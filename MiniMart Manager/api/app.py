from fastapi import FastAPI, BackgroundTasks
from tortoise.contrib.fastapi import register_tortoise
from models import (
    supplier_pydantic, supplier_pydanticIn, Supplier,
    product_pydantic, product_pydanticIn, Product
)

# email
from typing import List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr, SecretStr
from starlette.responses import JSONResponse

# dotenv
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
DB_URI = os.getenv('DB_URI')

# credentials
EMAIL = os.getenv('EMAIL')
PASS = os.getenv('PASS')

# adding cors headers (Cross-Origin Resource Sharing)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# adding cors urls
origins = ["http://localhost:3000"]

# add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def index():
    return {"Msg": "go to /docs for documentation"}

@app.post('/supplier')
async def add_supplier(supplier_info: supplier_pydanticIn):
    supplier_obj = await Supplier.create(**supplier_info.dict(exclude_unset=True))
    response = await supplier_pydantic.from_tortoise_orm(supplier_obj)
    return {"Status": "ok", "data": response}

@app.get('/supplier')
async def get_all_suppliers():
    response = await supplier_pydantic.from_queryset(Supplier.all())
    return {"Status": "ok", "data": response}

@app.get('/supplier/{supplier_id}')
async def get_specific_supplier(supplier_id: int):
    response = await supplier_pydantic.from_queryset_single(Supplier.get(id=supplier_id))
    return {"Status": "ok", "data": response}

@app.put('/supplier/{supplier_id}')
async def update_supplier(supplier_id: int, updated_info: supplier_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    update_info = updated_info.dict(exclude_unset=True)
    supplier.name = update_info['name']
    supplier.company = update_info['company']
    supplier.phone = update_info['phone']
    supplier.email = update_info['email']
    await supplier.save()
    response = await supplier_pydantic.from_tortoise_orm(supplier)
    return {"Status": "ok", "data": response}

@app.delete('/supplier/{supplier_id}')
async def delete_supplier(supplier_id: int):
    await Supplier.get(id=supplier_id).delete()
    return {"Status": "ok"}

@app.post('/product/{supplier_id}')
async def add_product(supplier_id: int, product_details: product_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    product_dict = product_details.dict(exclude_unset=True)
    product_dict['revenue'] = product_dict.get('quantity_sold', 0) * product_dict.get('unit_price', 0)
    product_obj = await Product.create(**product_dict, supplied_by=supplier)
    response = await product_pydantic.from_tortoise_orm(product_obj)
    return {"Status": "ok", "data": response}

@app.get('/product')
async def all_products():
    response = await product_pydantic.from_queryset(Product.all())
    return {"Status": "ok", "data": response}

@app.get('/product/{id}')
async def specific_product(id: int):
    response = await product_pydantic.from_queryset_single(Product.get(id=id))
    return {"Status": "ok", "data": response}

@app.put('/product/{id}')
async def update_product(id: int, update_info: product_pydanticIn):
    product = await Product.get(id=id)
    info = update_info.dict(exclude_unset=True)
    product.name = info['name']
    product.quantity_in_Stock = info['quantity_in_Stock']
    product.revenue += info['quantity_sold'] * info['unit_price']
    product.quantity_sold += info['quantity_sold']
    product.unit_price = info['unit_price']
    await product.save()
    response = await product_pydantic.from_tortoise_orm(product)
    return {"Status": "ok", "data": response}

@app.delete('/product/{id}')
async def delete_product(id: int):
    await Product.filter(id=id).delete()
    return {"Status": "ok"}

class EmailSchema(BaseModel):
    email: List[EmailStr]

class EmailContent(BaseModel):
    message: str
    subject: str

conf = ConnectionConfig(
    MAIL_USERNAME=EMAIL,
    MAIL_PASSWORD=SecretStr(PASS),
    MAIL_FROM=EMAIL,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

@app.post('/email/{product_id}')
async def send_email(product_id: int, content: EmailContent):
    product = await Product.get(id=product_id)
    supplier = await product.supplied_by
    supplier_email = [supplier.email]
    html = f"""
    <h5>{supplier.company}</h5>
    <br>
    <p>{content.message}</p>
    <br>
    <h6>Best Regards</h6>
    <h6>Your Company</h6>
    """
    message = MessageSchema(
        subject=content.subject,
        recipients=supplier_email,
        body=html,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"Status": "ok"}

register_tortoise(
    app,
    db_url=DB_URI,
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)

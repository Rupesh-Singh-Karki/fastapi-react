from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from models import supplier_pydantic, supplier_pydanticIn, Supplier, product_pydanticIn, Product
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, SecretStr
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
DB_URI = os.getenv('DB_URI')
EMAIL = os.getenv('EMAIL')
PASS = os.getenv('PASS')

# Initialize FastAPI and CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def index():
    return {"Msg": "go to /docs for documentation"}

# Email config
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

class EmailContent(BaseModel):
    subject: str
    message: str

# Supplier endpoints
@app.post('/supplier')
async def add_supplier(supplier_data: supplier_pydanticIn):
    s = await Supplier.create(**supplier_data.dict(exclude_unset=True))
    return {"Status": "ok", "data": await supplier_pydantic.from_tortoise_orm(s)}

@app.get('/supplier')
async def list_suppliers():
    qs = await Supplier.all()
    data = [await supplier_pydantic.from_tortoise_orm(s) for s in qs]
    return {"Status": "ok", "data": data}

@app.get('/supplier/{supplier_id}')
async def get_supplier(supplier_id: int):
    s = await Supplier.get(id=supplier_id)
    return {"Status": "ok", "data": await supplier_pydantic.from_tortoise_orm(s)}

@app.put('/supplier/{supplier_id}')
async def update_supplier(supplier_id: int, payload: supplier_pydanticIn):
    s = await Supplier.get(id=supplier_id)
    for k, v in payload.dict(exclude_unset=True).items(): setattr(s, k, v)
    await s.save()
    return {"Status": "ok", "data": await supplier_pydantic.from_tortoise_orm(s)}

@app.delete('/supplier/{supplier_id}')
async def delete_supplier(supplier_id: int):
    await Supplier.filter(id=supplier_id).delete()
    return {"Status": "ok"}

# Product endpoints using .values() to include supplied_by_id
@app.post('/product/{supplier_id}')
async def add_product(supplier_id: int, product_data: product_pydanticIn):
    await Supplier.get(id=supplier_id)  # ensure supplier exists
    p = await Product.create(**product_data.dict(exclude_unset=True), supplied_by_id=supplier_id)
    # fetch new record with supplied_by_id
    record = await Product.filter(id=p.id).values(
        'id', 'name', 'quantity_in_Stock', 'quantity_sold', 'unit_price', 'revenue', 'supplied_by_id'
    ).first()
    # convert decimals to string
    record['unit_price'] = str(record['unit_price'])
    record['revenue'] = str(record['revenue'])
    return {"Status": "ok", "data": record}

@app.get('/product')
async def list_products():
    records = await Product.all().values(
        'id', 'name', 'quantity_in_Stock', 'quantity_sold', 'unit_price', 'revenue', 'supplied_by_id'
    )
    for rec in records:
        rec['unit_price'] = str(rec['unit_price'])
        rec['revenue'] = str(rec['revenue'])
    return {"Status": "ok", "data": records}

@app.get('/product/{product_id}')
async def get_product(product_id: int):
    rec = await Product.filter(id=product_id).values(
        'id', 'name', 'quantity_in_Stock', 'quantity_sold', 'unit_price', 'revenue', 'supplied_by_id'
    ).first()
    rec['unit_price'] = str(rec['unit_price'])
    rec['revenue'] = str(rec['revenue'])
    return {"Status": "ok", "data": rec}

@app.put('/product/{product_id}')
async def update_product(product_id: int, payload: product_pydanticIn):
    await Product.filter(id=product_id).update(**payload.dict(exclude_unset=True))
    # fetch updated record
    rec = await Product.filter(id=product_id).values(
        'id', 'name', 'quantity_in_Stock', 'quantity_sold', 'unit_price', 'revenue', 'supplied_by_id'
    ).first()
    rec['unit_price'] = str(rec['unit_price'])
    rec['revenue'] = str(rec['revenue'])
    return {"Status": "ok", "data": rec}

@app.delete('/product/{product_id}')
async def delete_product(product_id: int):
    await Product.filter(id=product_id).delete()
    return {"Status": "ok"}

# Email endpoint
@app.post('/email/{product_id}')
async def email_supplier(product_id: int, email: EmailContent):
    supplier = await Product.get(id=product_id).supplied_by
    msg = MessageSchema(subject=email.subject, recipients=[supplier.email], body=f"<p>{email.message}</p>", subtype=MessageType.html)
    await FastMail(conf).send_message(msg)
    return {"Status": "ok"}

# Tortoise ORM registration
register_tortoise(app, db_url=DB_URI, modules={"models": ["models"]}, generate_schemas=True, add_exception_handlers=True)

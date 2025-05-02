FROM python:3.12.5-slim

WORKDIR /app

# point at the nested requirements.txt
COPY api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# bring in everything under api/
COPY api/ /app/

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

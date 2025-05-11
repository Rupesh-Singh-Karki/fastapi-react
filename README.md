# 🛒 MiniMart Manager

MiniMart Manager is a full-stack web application built with **FastAPI** (Python backend) and **React** (frontend), powered by a **PostgreSQL** database. It allows CRUD operations for products and suppliers, including tracking stock, sales, revenue, and supplier details.

This project is fully **Dockerized** and ready for development or deployment.

---

## 🚀 Features

- 📦 Manage Products (Add, Update, Delete)
- 🧑‍💼 Track Supplier Information
- 📊 Real-time inventory data (quantity sold, revenue, etc.)
- 🔄 Backend powered by FastAPI + Tortoise ORM + PostgreSQL
- 🌐 Frontend built with React
- 🐳 Dockerized for easy deployment

---

## 📁 Project Structure

```

MiniMart Manager/
├── api/                  # FastAPI backend
│   ├── app.py            # Main FastAPI app
│   ├── models.py         # Tortoise ORM models
│   ├── schemas.py        # Pydantic schemas
│   ├── ...               # Other backend files
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # ProductRow, SupplierRow etc.
│   │   ├── pages/
│   │   └── App.js        # Main frontend app
│   └── ...
├── docker-compose.yml    # Docker Compose setup
├── Dockerfile            # Backend Dockerfile
└── README.md             # You're here!

````

---

## 🐳 Running with Docker

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Step-by-Step

1. **Clone the repository**

```bash
git clone https://github.com/your-username/minimart-manager.git
cd minimart-manager
````

2. **Create `.env` file** in root (same level as `docker-compose.yml`):

```
DB_URI=postgres://myuser:mypassword@db:5432/karkibase
```

3. **Build & Start Containers**

```bash
docker-compose up --build
```

This will:

* Start PostgreSQL on port `5432`
* Start the backend API on `http://localhost:8000`

4. **(Optional) Push updated backend image to Docker Hub**

```bash
docker build -t rupesh69/minimart-api:v1 .
docker push rupesh69/minimart-api:v1
```

---

## 🔌 API Endpoints (FastAPI)

| Endpoint         | Method | Description         |
| ---------------- | ------ | ------------------- |
| `/product/`      | GET    | List all products   |
| `/product/{id}`  | GET    | Get product by ID   |
| `/product/`      | POST   | Create new product  |
| `/product/{id}`  | PUT    | Update product      |
| `/product/{id}`  | DELETE | Delete product      |
| `/supplier/`     | GET    | List all suppliers  |
| `/supplier/{id}` | GET    | Get supplier by ID  |
| `/supplier/`     | POST   | Create new supplier |
| `/supplier/{id}` | PUT    | Update supplier     |
| `/supplier/{id}` | DELETE | Delete supplier     |

---

## ⚙️ Tech Stack

* **Backend**: FastAPI, Tortoise ORM, PostgreSQL
* **Frontend**: React, Bootstrap
* **Database**: PostgreSQL
* **Containerization**: Docker, Docker Compose

---

## 👤 Author

**Rupesh Singh Karki**
2nd Year B.Tech CSE @ MAIT
GitHub: (https://github.com/Rupesh-Singh-Karki)

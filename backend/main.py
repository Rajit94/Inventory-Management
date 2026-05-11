from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from sqlalchemy.exc import SQLAlchemyError
import logging
from routers import products, categories, suppliers, dashboard

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Inventory Management API",
    description="A REST API to manage products, categories, suppliers and stock levels.",
    version="1.0.0"
)

# Allows React frontend (localhost:5173) to talk to this API
app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:5173",
        "https://inventory-management-six-eosin.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registers all routers
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def initialize_database():
    try:
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except SQLAlchemyError as exc:
        logger.error(
            "Database initialization failed. Check DATABASE_URL credentials and PostgreSQL status. Error: %s",
            exc,
        )


@app.get("/")
def root():
    return {"message": "Inventory Management API is running"}

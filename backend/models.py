from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    __tablename__ = "categories"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # One category has many products
    products = relationship("Product", back_populates="category")


class Supplier(Base):
    __tablename__ = "suppliers"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(150), nullable=False)
    email      = Column(String(150), unique=True, nullable=True)
    phone      = Column(String(20), nullable=True)
    address    = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # One supplier has many products
    products = relationship("Product", back_populates="supplier")


class Product(Base):
    __tablename__ = "products"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price       = Column(Float, nullable=False)
    quantity    = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    category   = relationship("Category", back_populates="products")
    supplier   = relationship("Supplier", back_populates="products")
    stock_logs = relationship("StockLog", back_populates="product")


class StockLog(Base):
    __tablename__ = "stock_logs"

    id         = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    change     = Column(Integer, nullable=False)   # positive = stock in, negative = stock out
    reason     = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="stock_logs")
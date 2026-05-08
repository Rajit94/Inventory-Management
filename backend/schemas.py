from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ───────────────────────────── Category ─────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ───────────────────────────── Supplier ─────────────────────────────

class SupplierCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ───────────────────────────── Product ──────────────────────────────

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int = 0
    low_stock_threshold: int = 10
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    quantity: int
    low_stock_threshold: int
    category: Optional[CategoryOut]
    supplier: Optional[SupplierOut]
    created_at: datetime

    class Config:
        from_attributes = True


# ───────────────────────────── StockLog ─────────────────────────────

class StockLogCreate(BaseModel):
    product_id: int
    change: int          # positive = restock, negative = sale/removal
    reason: Optional[str] = None

class StockLogOut(BaseModel):
    id: int
    product_id: int
    change: int
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ───────────────────────────── Dashboard ────────────────────────────

class DashboardStats(BaseModel):
    total_products: int
    total_categories: int
    total_suppliers: int
    low_stock_count: int
    out_of_stock_count: int
    total_stock_value: float
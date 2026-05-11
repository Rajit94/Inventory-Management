from sqlalchemy.orm import Session

import models
import schemas
from security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ───────────────────────────── Category ─────────────────────────────

def get_categories(db: Session):
    return db.query(models.Category).all()

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if not db_category:
        return None
    for key, value in category.model_dump(exclude_unset=True).items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if not db_category:
        return None
    db.delete(db_category)
    db.commit()
    return db_category


# ───────────────────────────── Supplier ─────────────────────────────

def get_suppliers(db: Session):
    return db.query(models.Supplier).all()

def get_supplier(db: Session, supplier_id: int):
    return db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()

def create_supplier(db: Session, supplier: schemas.SupplierCreate):
    db_supplier = models.Supplier(**supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def update_supplier(db: Session, supplier_id: int, supplier: schemas.SupplierUpdate):
    db_supplier = get_supplier(db, supplier_id)
    if not db_supplier:
        return None
    for key, value in supplier.model_dump(exclude_unset=True).items():
        setattr(db_supplier, key, value)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def delete_supplier(db: Session, supplier_id: int):
    db_supplier = get_supplier(db, supplier_id)
    if not db_supplier:
        return None
    db.delete(db_supplier)
    db.commit()
    return db_supplier


# ───────────────────────────── Product ──────────────────────────────

def get_products(db: Session):
    return db.query(models.Product).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    for key, value in product.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product


# ───────────────────────────── StockLog ─────────────────────────────

def create_stock_log(db: Session, stock_log: schemas.StockLogCreate):
    # Update the product quantity
    db_product = get_product(db, stock_log.product_id)
    if not db_product:
        return None
    db_product.quantity += stock_log.change

    # Save the log entry
    db_log = models.StockLog(**stock_log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_stock_logs(db: Session, product_id: int):
    return db.query(models.StockLog).filter(models.StockLog.product_id == product_id).all()


# ───────────────────────────── Dashboard ────────────────────────────

def get_dashboard_stats(db: Session):
    products   = db.query(models.Product).all()
    categories = db.query(models.Category).count()
    suppliers  = db.query(models.Supplier).count()

    low_stock     = sum(1 for p in products if 0 < p.quantity <= p.low_stock_threshold)
    out_of_stock  = sum(1 for p in products if p.quantity == 0)
    stock_value   = sum(p.price * p.quantity for p in products)

    return {
        "total_products":    len(products),
        "total_categories":  categories,
        "total_suppliers":   suppliers,
        "low_stock_count":   low_stock,
        "out_of_stock_count": out_of_stock,
        "total_stock_value": round(stock_value, 2),
    }

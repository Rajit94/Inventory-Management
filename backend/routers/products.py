from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud, schemas

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[schemas.ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=schemas.ProductOut, status_code=201)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    updated = crud.update_product(db, product_id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# ── Stock log endpoints (nested under products) ──

@router.post("/{product_id}/stock", response_model=schemas.StockLogOut, status_code=201)
def update_stock(product_id: int, stock_log: schemas.StockLogCreate, db: Session = Depends(get_db)):
    stock_log.product_id = product_id
    result = crud.create_stock_log(db, stock_log)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result


@router.get("/{product_id}/stock", response_model=list[schemas.StockLogOut])
def get_stock_history(product_id: int, db: Session = Depends(get_db)):
    return crud.get_stock_logs(db, product_id)
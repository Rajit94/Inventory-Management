from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import DashboardStats
import crud
from security import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any

from .. import auth
from ..database import get_database
from ..models import schemas
from ..services import insights_service

router = APIRouter()

@router.get("/summary", response_model=Dict[str, Any])
async def get_summary(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    """
    Endpoint to get a summary of total expenses, monthly expenses, 
    and transaction count for the dashboard.
    """
    summary = await insights_service.get_dashboard_summary(db, current_user)
    return summary

@router.get("/by-category", response_model=Dict[str, float])
async def get_by_category(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    """
    Endpoint to get total spending grouped by category for charts.
    """
    category_totals = await insights_service.get_spending_by_category(db, current_user)
    return category_totals
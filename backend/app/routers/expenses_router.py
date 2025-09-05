from fastapi import APIRouter, Depends, status, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from .. import auth
from ..database import get_database
from ..models import schemas
from ..services import expense_service

# Helper function to reliably format the database document into the response shape
def format_expense(doc: dict) -> dict:
    return {
        **doc,
        "id": str(doc["_id"]),
        "owner_id": str(doc["owner_id"]),
    }

router = APIRouter()

@router.post("/", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense: schemas.ExpenseCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    created_doc = await expense_service.add_expense(db, expense, current_user)
    if created_doc is None:
        raise HTTPException(status_code=500, detail="Failed to create expense.")
    return format_expense(created_doc)


@router.get("/", response_model=List[schemas.ExpenseResponse])
async def get_all_expenses(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    expenses_docs = await expense_service.get_expenses_by_owner(db, current_user)
    # Explicitly format every document to ensure the ID is a string
    return [format_expense(doc) for doc in expenses_docs]

@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
async def update_expense(
    expense_id: str,
    expense: schemas.ExpenseUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    updated_doc = await expense_service.update_expense_by_id(db, expense_id, expense, current_user)
    if updated_doc is None:
        raise HTTPException(status_code=404, detail="Expense not found.")
    return format_expense(updated_doc)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.UserInDB = Depends(auth.get_current_user)
):
    deleted = await expense_service.delete_expense_by_id(db, expense_id, current_user)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found.")
    return
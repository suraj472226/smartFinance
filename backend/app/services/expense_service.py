from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any, Optional
from bson import ObjectId

from ..models.schemas import ExpenseCreate, ExpenseInDB, UserInDB, ExpenseUpdate

EXPENSES_COLLECTION = "expenses"

async def add_expense(db: AsyncIOMotorDatabase, expense: ExpenseCreate, user: UserInDB) -> Dict[str, Any]:
    """
    Creates a new expense record in the database for the given user.
    Returns the newly created document as a dictionary.
    """
    expense_in_db = ExpenseInDB(
        **expense.model_dump(),
        owner_id=user.id
    )
    
    expense_doc = expense_in_db.model_dump(exclude={"id"})
    
    result = await db[EXPENSES_COLLECTION].insert_one(expense_doc)
    
    created_doc = await db[EXPENSES_COLLECTION].find_one({"_id": result.inserted_id})
    
    return created_doc

async def get_expenses_by_owner(db: AsyncIOMotorDatabase, user: UserInDB) -> List[dict]:
    """
    Retrieves all expenses from the database for a specific user.
    """
    expenses = []
    cursor = db[EXPENSES_COLLECTION].find({"owner_id": user.id})
    async for document in cursor:
        expenses.append(document)
        
    return expenses

async def update_expense_by_id(db: AsyncIOMotorDatabase, expense_id: str, expense_update: ExpenseUpdate, user: UserInDB) -> Optional[Dict[str, Any]]:
    """
    Updates an expense by its ID, ensuring it belongs to the current user.
    """
    # Create a dictionary of fields to update, excluding any that are None
    update_data = {k: v for k, v in expense_update.model_dump().items() if v is not None}

    # If there's nothing to update, don't perform the operation
    if not update_data:
        return await db[EXPENSES_COLLECTION].find_one({"_id": ObjectId(expense_id), "owner_id": user.id})

    result = await db[EXPENSES_COLLECTION].update_one(
        {"_id": ObjectId(expense_id), "owner_id": user.id},
        {"$set": update_data}
    )

    if result.modified_count > 0:
        updated_doc = await db[EXPENSES_COLLECTION].find_one({"_id": ObjectId(expense_id)})
        return updated_doc
    
    # If nothing was modified (e.g., expense not found), check if the doc exists
    # This handles cases where the submitted data is identical to the existing data
    existing_doc = await db[EXPENSES_COLLECTION].find_one({"_id": ObjectId(expense_id), "owner_id": user.id})
    return existing_doc


async def delete_expense_by_id(db: AsyncIOMotorDatabase, expense_id: str, user: UserInDB) -> bool:
    """
    Deletes an expense by its ID, ensuring it belongs to the current user.
    Returns True if an expense was deleted, False otherwise.
    """
    delete_result = await db[EXPENSES_COLLECTION].delete_one(
        {"_id": ObjectId(expense_id), "owner_id": user.id}
    )
    return delete_result.deleted_count > 0
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from typing import Dict, Any

from ..models.schemas import UserInDB
from . import expense_service

async def get_dashboard_summary(db: AsyncIOMotorDatabase, user: UserInDB) -> Dict[str, Any]:
    """
    Calculates a summary of expenses for the dashboard.
    """
    collection = db[expense_service.EXPENSES_COLLECTION]
    
    # Define the start of the current month
    today = datetime.now(timezone.utc)
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Create the aggregation pipeline
    pipeline = [
        {"$match": {"owner_id": user.id}},
        {"$facet": {
            "total_expenses": [
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ],
            "month_expenses": [
                {"$match": {"date": {"$gte": start_of_month}}},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ],
            "transaction_count": [
                {"$count": "count"}
            ]
        }}
    ]
    
    result = await collection.aggregate(pipeline).to_list(1)
    
    # Process the aggregation result
    if not result:
        return {"total_expenses": 0, "month_expenses": 0, "transaction_count": 0}
        
    data = result[0]
    summary = {
        "total_expenses": data["total_expenses"][0]["total"] if data["total_expenses"] else 0,
        "month_expenses": data["month_expenses"][0]["total"] if data["month_expenses"] else 0,
        "transaction_count": data["transaction_count"][0]["count"] if data["transaction_count"] else 0
    }
    
    return summary

async def get_spending_by_category(db: AsyncIOMotorDatabase, user: UserInDB) -> Dict[str, float]:
    """
    Calculates the total spending for each category.
    """
    collection = db[expense_service.EXPENSES_COLLECTION]
    
    pipeline = [
        {"$match": {"owner_id": user.id}},
        {"$group": {
            "_id": "$category",
            "total_amount": {"$sum": "$amount"}
        }}
    ]
    
    results = {}
    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        results[doc["_id"]] = doc["total_amount"]
        
    return results
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional

from ..models.schemas import UserCreate, UserInDB
from ..security import get_password_hash

USERS_COLLECTION = "users"

async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[UserInDB]:
    """Finds a user by their email in the database."""
    user_doc = await db[USERS_COLLECTION].find_one({"email": email})
    if user_doc:
        return UserInDB(**user_doc)
    return None

async def create_user(db: AsyncIOMotorDatabase, user: UserCreate) -> UserInDB:
    """Creates a new user in the database."""
    hashed_password = get_password_hash(user.password)
    
    user_in_db = UserInDB(
        email=user.email,
        hashed_password=hashed_password
    )
    
    # Using model_dump to convert Pydantic model to a dict for MongoDB
    user_doc = user_in_db.model_dump(exclude={"id"}) 
    
    await db[USERS_COLLECTION].insert_one(user_doc)
    
    return user_in_db
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from .. import security
from ..database import get_database
from ..models import schemas
from ..services import user_service

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user: schemas.UserCreate, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handles user registration."""
    db_user = await user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = await user_service.create_user(db, user)
    created_user_doc = await db[user_service.USERS_COLLECTION].find_one({"email": new_user.email})
    
    # Manually format the response to guarantee the ID is a string
    return {
        "id": str(created_user_doc["_id"]),
        "email": created_user_doc["email"]
    }


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: schemas.UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handles user login and returns a JWT access token."""
    user = await user_service.get_user_by_email(db, email=form_data.email)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
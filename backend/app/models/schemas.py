from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

# This class is only used for internal validation within other Pydantic models.
# It will not be part of the final API output.
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if isinstance(v, ObjectId):
            return v
        if ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler=None):
        json_schema = handler(core_schema)
        json_schema.update(type='string', example='60c72b2f9b1e8b3b3e3e3e3e')
        return json_schema

# --- Base Model for DB Interaction ---
class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, example="strongpassword123")

# This is the final shape of the JSON sent to the frontend. Note `id` is a simple `str`.
class UserResponse(UserBase):
    id: str = Field(..., example="60c72b2f9b1e8b3b3e3e3e3e")

class UserInDB(MongoBaseModel):
    email: EmailStr
    hashed_password: str


# --- Expense Schemas ---
class ExpenseBase(BaseModel):
    description: str = Field(..., example="Coffee with team")
    amount: float = Field(..., gt=0, example=5.50)
    category: str = Field(..., example="Food")
    date: datetime = Field(..., example="2025-09-05T10:00:00Z")

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime] = None

# This is the final shape of the JSON sent to the frontend. Note `id` and `owner_id` are simple `str`.
class ExpenseResponse(ExpenseBase):
    id: str = Field(..., example="60c72b2f9b1e8b3b3e3e3e3f")
    owner_id: str = Field(..., example="60c72b2f9b1e8b3b3e3e3e")

class ExpenseInDB(MongoBaseModel):
    description: str
    amount: float
    category: str
    date: datetime
    owner_id: PyObjectId


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
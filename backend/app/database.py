import motor.motor_asyncio
from .config import settings

class MongoDB:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db: motor.motor_asyncio.AsyncIOMotorDatabase = None

# Create an instance of the MongoDB connection manager
db_manager = MongoDB()

async def connect_to_mongo():
    """
    Connects to the MongoDB instance on application startup.
    """
    print("Connecting to MongoDB...")
    db_manager.client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongo_details)
    db_manager.db = db_manager.client[settings.database_name]
    print("Successfully connected to MongoDB!")

async def close_mongo_connection():
    """
    Closes the MongoDB connection on application shutdown.
    """
    print("Closing MongoDB connection...")
    db_manager.client.close()
    print("MongoDB connection closed.")

def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    """
    A dependency function to get the database instance for API endpoints.
    """
    return db_manager.db
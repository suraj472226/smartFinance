from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import connect_to_mongo, close_mongo_connection
from .routers import auth_router, expenses_router, insights_router, upload_router # <-- ADDED upload_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on application startup
    await connect_to_mongo()
    yield
    # Code to run on application shutdown
    await close_mongo_connection()

app = FastAPI(
    lifespan=lifespan,
    title="Smart Finance Assistant API",
    description="Backend for the AI-driven expense classifier with personalized insights.",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
app.include_router(auth_router.router, tags=["Authentication"], prefix="/api/auth")
app.include_router(expenses_router.router, tags=["Expenses"], prefix="/api/expenses")
app.include_router(insights_router.router, tags=["Insights"], prefix="/api/insights")
app.include_router(upload_router.router, tags=["Upload"], prefix="/api/upload") # <-- ADDED THIS LINE

# --- Root Endpoint ---
@app.get("/", tags=["Root"])
async def read_root():
    """ A simple endpoint to confirm the API is running. """
    return {"message": "Welcome to the Smart Finance Assistant API!"}
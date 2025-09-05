from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Loads configuration settings from environment variables.
    Pydantic automatically matches environment variable names (case-insensitively).
    """
    mongo_details: str
    database_name: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        # Specifies the file to load environment variables from
        env_file = ".env"

# Create a single instance of the settings to be used throughout the app
settings = Settings()
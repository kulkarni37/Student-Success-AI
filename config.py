import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = "student-success-ai"
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
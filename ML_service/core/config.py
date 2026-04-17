import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_NAME = "gemini-1.5-flash" 
    
    @staticmethod
    def setup_gemini():
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in .env")
        genai.configure(api_key=Config.GEMINI_API_KEY)
        return genai.GenerativeModel(Config.MODEL_NAME)

config = Config()

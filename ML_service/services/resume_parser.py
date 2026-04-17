import fitz  # PyMuPDF
import json
import re
from core.config import config

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts raw text from a PDF file with basic cleanup."""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        
        # Basic cleanup: remove excessive whitespace and normalize line endings
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r' +', ' ', text)
        return text.strip()
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
        return ""

def parse_with_gemini(text: str) -> dict:
    """Uses Gemini LLM to convert resume text into structured JSON."""
    model = config.setup_gemini()
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Resume Parser. 
    Analyze the following resume text and extract key information into a clean JSON format.

    RESUME TEXT:
    {text[:10000]}

    EXTRACT THE FOLLOWING JSON FIELDS:
    - skills: (A comprehensive list of specific technical, soft, and tool-based skills found in the text)
    - role: (The primary job title, current position, or professional specialization)
    - experience_level: (Identify as one of: "Entry-level", "Junior", "Mid-level", "Senior", "Lead")
    - resume_strength: (A score from 0 to 100 based on formatting, clarity, and skill depth)
    - tips: (A list of 3 highly specific, actionable tips to improve this resume for the identified role)
    - projects: (List of notable project names with a short 1-sentence description)
    - education: (Most recent or relevant degree and institution)
    - summary: (A professional 2-sentence summary of the profile)

    STRICT GUIDELINES:
    1. Return ONLY the raw JSON object.
    2. Do NOT include any markdown formatting like ```json or ```.
    3. Ensure all keys and strings are properly quoted.
    4. If a piece of information is missing, use null or an empty list [].
    5. Clean up skill names (e.g., "Python Programming" -> "Python").
    6. Ensure the output is valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Robustly handle markdown code blocks if the LLM still includes them
        if "```" in text_response:
            # Extract content between triple backticks
            matches = re.findall(r"```(?:json)?\n?(.*?)\n?```", text_response, re.DOTALL)
            if matches:
                text_response = matches[0].strip()
        
        return json.loads(text_response)
    except Exception as e:
        print(f"Gemini Parsing Error: {e}")
        return {}

def generate_structured_profile(pdf_path: str) -> dict:
    """Main entry point for parsing a resume file."""
    raw_text = extract_text_from_pdf(pdf_path)
    if not raw_text.strip():
        return {"error": "Could not extract text from PDF"}
        
    profile = parse_with_gemini(raw_text)
    return profile

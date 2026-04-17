import fitz  # PyMuPDF
import json
import re
from core.config import config

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts raw text from a PDF file."""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def parse_with_gemini(text: str) -> dict:
    """Uses Gemini LLM to convert resume text into structured JSON."""
    model = config.setup_gemini()
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Resume Parser. 
    Analyze the following resume text and extract key information into a clean JSON format.

    RESUME TEXT:
    {text[:10000]}

    EXTRACT THE FOLLOWING JSON FIELDS:
    - skills: (A comprehensive list of technical, soft, and tool-based skills)
    - role: (Primary job title or specialization)
    - experience_level: (One of: "Entry-level", "Junior", "Mid-level", "Senior", "Lead")
    - projects: (List of significant project names with a 1-sentence description each)
    - education: (Most relevant degree and institution)
    - summary: (A 2-sentence professional bio)

    GUIDELINES:
    - Return ONLY the raw JSON object.
    - Do not include markdown code blocks (e.g., no ```json).
    - If a field is missing, use null or an empty list.
    - Ensure field names match EXACTLY as listed above.
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

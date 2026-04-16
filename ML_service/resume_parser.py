import fitz  # PyMuPDF
import re

SKILL_DB = [
    "Python", "JavaScript", "React", "Node.js", "Express", "MongoDB", 
    "SQL", "TypeScript", "Docker", "AWS", "Git", "Java", "C++", 
    "Machine Learning", "NLP", "Pandas", "Scikit-learn", "HTML", "CSS"
]

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def parse_resume_data(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    
    found_skills = []
    for skill in SKILL_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.I):
            found_skills.append(skill)
            
    # Mock education/experience extraction
    education = "Extracted from PDF" if "university" in text.lower() else "Not found"
    
    return {
        "skills": found_skills,
        "education": education,
        "raw_length": len(text)
    }

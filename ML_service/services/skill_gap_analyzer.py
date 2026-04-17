import json
from core.config import config
from services.skill_normalizer import normalize_skills_list

def analyze_skill_gap(candidate_skills: list, job_skills: list) -> dict:
    cand_norm = set(normalize_skills_list(candidate_skills))
    job_norm = set(normalize_skills_list(job_skills))
    
    missing_skills = list(job_norm - cand_norm)
    
    if not missing_skills:
        return {
            "missing_skills": [],
            "recommendation": "You have all the required skills for this role! Great job."
        }
    
    model = config.setup_gemini()
    prompt = f"""
    A candidate is applying for a job but is missing the following skills: {', '.join(missing_skills)}.
    
    Provide 2-3 specific, actionable learning recommendations (courses, projects, or concepts) 
    that will help the candidate bridge this gap for a career in this field.
    Keep the advice concise and encouraging.
    """
    
    try:
        response = model.generate_content(prompt)
        recommendation = response.text.strip()
        return {
            "missing_skills": missing_skills,
            "recommendation": recommendation
        }
    except Exception as e:
        print(f"Skill Gap AI Error: {e}")
        return {
            "missing_skills": missing_skills,
            "recommendation": "Focus on learning the missing skills listed above."
        }

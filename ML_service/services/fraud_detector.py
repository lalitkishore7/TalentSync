import json
from core.config import config

def detect_fraud(job_description: str) -> dict:
    model = config.setup_gemini()
    prompt = f"""
    You are an AI Security Analyst specializing in identifying fraudulent job postings.
    Analyze the following job description for signs of a scam. 
    Look out for:
    - Demands for payment, training fees, or equipment purchases
    - Overly vague descriptions with unbelievably high salaries
    - Requests for sensitive personal information upfront
    - Unprofessional language or suspicious contact methods (e.g., Telegram only)
    
    Job Description:
    {job_description[:5000]}
    
    Output strictly in this JSON format:
    {{
      "is_fraud": true/false,
      "risk_score": <int 0-100>, // 0 is safe, 100 is definite scam
      "reasons": ["reason 1", "reason 2"]
    }}
    """
    try:
        response = model.generate_content(prompt)
        resp_text = response.text.strip()
        if resp_text.startswith("```json"):
            resp_text = resp_text.replace("```json", "").replace("```", "").strip()
        return json.loads(resp_text)
    except Exception as e:
        print(f"Fraud Detection Error: {e}")
        return {
            "is_fraud": False,
            "risk_score": 0,
            "reasons": ["Error performing AI security check."]
        }

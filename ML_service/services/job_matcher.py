import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from core.config import config
from services.skill_normalizer import normalize_skills_list

def get_gemini_embedding(text: str) -> np.ndarray:
    try:
        config.setup_gemini()
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="clustering"
        )
        return np.array(result['embedding'])
    except Exception as e:
        print(f"Embedding Error: {e}")
        return np.zeros(768)

def calculate_hybrid_score(candidate_skills: list, job_skills: list, job_description: str) -> int:
    cand_norm = normalize_skills_list(candidate_skills)
    job_norm = normalize_skills_list(job_skills)
    
    cand_text = " ".join(cand_norm)
    job_skills_text = " ".join(job_norm)

    if not job_norm or not cand_norm:
        keyword_score = 0
    else:
        vectorizer = TfidfVectorizer()
        try:
            tfidf_matrix = vectorizer.fit_transform([cand_text, job_skills_text])
            kw_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            keyword_score = kw_sim * 100
        except ValueError:
            keyword_score = 0

    job_text = f"{job_skills_text}. {job_description}"
    cand_emb = get_gemini_embedding(cand_text)
    job_emb = get_gemini_embedding(job_text)
    
    norm_a = np.linalg.norm(cand_emb)
    norm_b = np.linalg.norm(job_emb)
    
    if norm_a == 0 or norm_b == 0:
        semantic_score = 0
    else:
        dot_product = np.dot(cand_emb, job_emb)
        semantic_score = (dot_product / (norm_a * norm_b)) * 100

    final_score = (0.5 * keyword_score) + (0.5 * semantic_score)
    return int(min(max(final_score, 0), 100))

def match_jobs(candidate_skills: list, jobs: list) -> list:
    results = []
    for job in jobs:
        score = calculate_hybrid_score(candidate_skills, job.get('skillsRequired', []), job.get('description', ''))
        results.append({ "jobId": job.get('id') or str(job.get('_id')), "score": score })
    return sorted(results, key=lambda x: x['score'], reverse=True)

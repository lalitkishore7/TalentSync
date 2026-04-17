import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from core.config import config
from services.skill_normalizer import normalize_skills_list

def extract_skills_from_text(text: str) -> set:
    """Fallback extractor that finds known skills in raw text when AI is down."""
    from services.skill_normalizer import SKILL_MAP
    found = set()
    text_lower = text.lower()
    # Check for keys in SKILL_MAP
    for key, value in SKILL_MAP.items():
        if key in text_lower:
            found.add(value)
    # Check for direct matches of some major common skills not in SKILL_MAP keys
    common_skills = ["python", "javascript", "react", "node.js", "java", "html", "css", "sql", "typescript"]
    for s in common_skills:
        if s in text_lower:
            found.add(s.title() if s != "node.js" else "Node.js")
    return found

def get_gemini_embedding(text: str) -> np.ndarray:
    try:
        config.setup_gemini()
        # Using the latest stable embedding model name
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="clustering"
        )
        return np.array(result['embedding'])
    except Exception as e:
        print(f"Embedding Error: {e}")
        # Return none to indicate failure for hybrid weighting
        return None

def calculate_hybrid_score(candidate_skills: list, job_skills: list, job_description: str) -> int:
    # 1. Normalize and resolve lists
    cand_norm = set(normalize_skills_list(candidate_skills))
    job_norm = set(normalize_skills_list(job_skills))
    
    # If job skills are empty (Quick Match), try to extract from description text
    if not job_norm and job_description:
        job_norm = extract_skills_from_text(job_description)

    # 2. Keyword Match (Jaccard-like Intersection)
    if not job_norm:
        keyword_score = 0
    else:
        intersection = cand_norm.intersection(job_norm)
        keyword_score = (len(intersection) / len(job_norm)) * 100

    # 3. Semantic Similarity (Embeddings)
    cand_text = " ".join(list(cand_norm))
    # Combine extracted skills + raw description for best context
    job_text = f"{' '.join(list(job_norm))}. {job_description}"
    
    cand_emb = get_gemini_embedding(cand_text)
    job_emb = get_gemini_embedding(job_text)
    
    if cand_emb is None or job_emb is None:
        # AI FAILED (Rate Limit / 429) -> Fallback to 100% Keyword Matching
        semantic_score = None
    else:
        norm_a = np.linalg.norm(cand_emb)
        norm_b = np.linalg.norm(job_emb)
        if norm_a == 0 or norm_b == 0:
            semantic_score = 0
        else:
            dot_product = np.dot(cand_emb, job_emb)
            semantic_score = (dot_product / (norm_a * norm_b)) * 100

    # 4. Final Hybrid Score
    if semantic_score is None:
        # AI is down/busy -> Keywords are the only source of truth
        final_score = keyword_score
    elif not job_norm:
        # No skills to intersection -> Semantic is only source of truth
        final_score = semantic_score
    else:
        # Standard balanced mode
        final_score = (0.6 * keyword_score) + (0.4 * semantic_score)
    
    # Floor at 0, cap at 100
    return int(min(max(final_score, 0), 100))

def match_jobs(candidate_skills: list, jobs: list) -> list:
    results = []
    for job in jobs:
        score = calculate_hybrid_score(candidate_skills, job.get('skillsRequired', []), job.get('description', ''))
        results.append({ "jobId": job.get('id') or str(job.get('_id')), "score": score })
    return sorted(results, key=lambda x: x['score'], reverse=True)


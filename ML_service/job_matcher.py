from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match(resume_skills, job_description):
    resume_text = " ".join(resume_skills)
    documents = [resume_text, job_description]
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return float(similarity[0][0]) * 100

def get_recommendations(resume_skills, jobs):
    recommendations = []
    for job in jobs:
        score = calculate_match(resume_skills, job['description'])
        recommendations.append({
            "job_id": job['id'],
            "score": round(score, 2)
        })
    
    # Sort by score descending
    return sorted(recommendations, key=lambda x: x['score'], reverse=True)

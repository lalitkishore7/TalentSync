import re

# Dictionary of synonyms for normalization
# Format: "misspelled/alternative": "Standard Name"
SKILL_MAP = {
    "react.js": "React",
    "reactjs": "React",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "js": "JavaScript",
    "ts": "TypeScript",
    "tailwind": "Tailwind CSS",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "python3": "Python",
    "ml": "Machine Learning",
    "ai": "Artificial Intelligence",
    "aws": "Amazon Web Services",
    "gcp": "Google Cloud Platform",
}

def normalize_skill(skill: str) -> str:
    """Normalizes a single skill name."""
    cleaned = skill.strip().lower()
    return SKILL_MAP.get(cleaned, skill.strip())

def normalize_skills_list(skills: list) -> list:
    """Normalizes a list of skills, removing duplicates."""
    normalized = set()
    for s in skills:
        norm = normalize_skill(s)
        if norm:
            normalized.add(norm)
    return sorted(list(normalized))

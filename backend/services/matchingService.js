/**
 * Job Matching & Ranking Service
 * TF-IDF Cosine Similarity + Skill Overlap + Experience Scoring
 * Replaces the Python ML microservice dependency.
 */

const natural = require('natural');
const { anonymizeResume } = require('./biasRemoval');

const TfIdf = natural.TfIdf;

/**
 * Compute TF-IDF cosine similarity between two text documents
 */
function tfidfSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const tfidf = new TfIdf();
  tfidf.addDocument(text1.toLowerCase());
  tfidf.addDocument(text2.toLowerCase());

  // Build term vectors
  const terms = new Set();
  tfidf.listTerms(0).forEach(t => terms.add(t.term));
  tfidf.listTerms(1).forEach(t => terms.add(t.term));

  const vec1 = [];
  const vec2 = [];
  
  for (const term of terms) {
    vec1.push(tfidf.tfidf(term, 0));
    vec2.push(tfidf.tfidf(term, 1));
  }

  // Cosine similarity
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Compute match score between a candidate and a single job
 */
function matchCandidateToJob(candidateData, job) {
  const candidateSkills = (candidateData.skills || []).map(s => s.toLowerCase().trim());
  const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase().trim());

  // 1. Skill Overlap Score (40%)
  const matchedSkills = candidateSkills.filter(s => 
    jobSkills.some(js => js.includes(s) || s.includes(js))
  );
  const missingSkills = jobSkills.filter(s => 
    !candidateSkills.some(cs => cs.includes(s) || s.includes(cs))
  );
  const skillScore = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 100 
    : 50; // neutral if no skills specified

  // 2. TF-IDF Semantic Score (40%) — uses anonymized text
  const anonymizedText = anonymizeResume(candidateData.raw_text || candidateSkills.join(' '));
  const jobText = (job.description || '') + ' ' + jobSkills.join(' ');
  const semanticRaw = tfidfSimilarity(anonymizedText, jobText);
  const semanticScore = Math.min(semanticRaw * 100, 100);

  // 3. Experience Score (20%)
  const candidateExp = candidateData.experience_years || 0;
  const requiredExp = job.minExperience || 0;
  let expScore = 100;
  if (requiredExp > 0 && candidateExp < requiredExp) {
    expScore = (candidateExp / requiredExp) * 100;
  }

  // Weighted final score
  const finalScore = (skillScore * 0.45) + (semanticScore * 0.35) + (expScore * 0.20);

  return {
    match_percent: Math.round(Math.min(finalScore, 100) * 10) / 10,
    skill_score: Math.round(skillScore * 10) / 10,
    semantic_score: Math.round(semanticScore * 10) / 10,
    exp_score: Math.round(expScore * 10) / 10,
    matched_skills: [...new Set(matchedSkills)],
    missing_skills: [...new Set(missingSkills)],
    bias_free: true
  };
}

/**
 * Rank all jobs for a candidate, sorted by match_percent descending
 */
function rankJobs(candidateData, jobs) {
  const ranked = jobs.map(job => {
    const matchData = matchCandidateToJob(candidateData, {
      skillsRequired: job.skillsRequired || [],
      description: job.description || '',
      minExperience: job.minExperience || 0
    });

    return {
      ...job.toObject ? job.toObject() : job,
      match: matchData.match_percent,
      matchData
    };
  });

  // Sort by match percentage descending
  ranked.sort((a, b) => b.match - a.match);

  return ranked;
}

/**
 * Match candidate against a single job description (for Quick Match feature)
 */
function quickMatch(candidateData, jobDescription) {
  return matchCandidateToJob(candidateData, {
    skillsRequired: [],
    description: jobDescription,
    minExperience: 0
  });
}

module.exports = { matchCandidateToJob, rankJobs, quickMatch };

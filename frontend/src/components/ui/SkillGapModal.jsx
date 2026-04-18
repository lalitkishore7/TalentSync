import { useState, useEffect } from 'react';
import { X, AlertCircle, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import axios from 'axios';
import './SkillGapModal.css';

export default function SkillGapModal({ isOpen, onClose, jobId, jobTitle }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && jobId) {
      fetchGap();
    }
  }, [isOpen, jobId]);

  const fetchGap = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/jobs/${jobId}/gap`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching skill gap:', err);
      setError('Failed to load skill analysis.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-x" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <h2>AI Skill Gap Analysis</h2>
          <p>For: <strong>{jobTitle}</strong></p>
        </div>

        {loading ? (
          <div className="loading-gap">
            <div className="spinner"></div>
            <span>Analyzing your profile against job requirements...</span>
          </div>
        ) : error ? (
          <div className="error-gap">{error}</div>
        ) : (
          <div className="gap-body">
            <div className="suitability-meter">
              <div className="meter-header">
                <span>Suitability Score</span>
                <span className="score-value">{data.suitability_score}%</span>
              </div>
              <div className="meter-bg">
                <div className="meter-fill" style={{ width: `${data.suitability_score}%`, background: data.suitability_score > 70 ? '#10b981' : data.suitability_score > 40 ? '#f59e0b' : '#ef4444' }} />
              </div>
            </div>

            <div className="skills-grid">
              <section className="skills-column">
                <h3><CheckCircle2 size={18} color="#10b981" /> Matching Skills</h3>
                <div className="skills-list">
                  {data.matching_skills && data.matching_skills.length > 0 ? (
                    data.matching_skills.map(s => <span key={s} className="skill-tag match">{s}</span>)
                  ) : <span className="no-data">None yet</span>}
                </div>
              </section>

              <section className="skills-column">
                <h3><AlertCircle size={18} color="#f59e0b" /> Missing Skills</h3>
                <div className="skills-list">
                  {data.missing_skills && data.missing_skills.length > 0 ? (
                    data.missing_skills.map(s => <span key={s} className="skill-tag missing">{s}</span>)
                  ) : (
                    <div className="no-gap">
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>Perfect match!</span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section className="optimization-section">
              <h3><Sparkles size={18} color="#8b5cf6" /> Optimization Tips</h3>
              <ul className="tips-list">
                {(data.optimization_tips || []).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="recommendation-section">
              <h3><BookOpen size={18} color="#3b82f6" /> AI Learning Path</h3>
              <div className="ai-advice">{data.recommendation}</div>
            </section>

            <div className="modal-footer">
              <button className="primary-btn" onClick={onClose}>Understood</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

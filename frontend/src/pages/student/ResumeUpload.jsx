import { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, X, Zap, CheckCircle, 
  Target, Sparkles, BookOpen, Search, 
  ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import './ResumeUpload.css';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  
  // Quick Match State
  const [jd, setJd] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setLoading(true);
    setParsed(false);
    setError('');
    setMatchResult(null);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', f);

    try {
      // Logic from your existing backend integration
      const response = await axios.post('http://localhost:8001/api/resumes/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const profile = response.data.analysis?.profile || {};
      const detectedSkills = profile.skills || [];
      
      const aiScore = profile.resume_strength;
      const baseScore = 60;
      const skillsBonus = Math.min(detectedSkills.length * 4, 30);
      const experienceBonus = profile.experience_level ? 10 : 0;
      const heuristicScore = Math.min(baseScore + skillsBonus + experienceBonus, 98);
      
      const finalScore = aiScore !== undefined && aiScore !== null ? aiScore : heuristicScore;

      setAnalysis({
        skills: detectedSkills,
        score: finalScore,
        role: profile.role || 'Software Engineer',
        experience: profile.experience_level || 'Mid-level',
        tips: profile.tips || [
          "Include outcome-based bullet points (e.g., 'Reduced latency by 20%')",
          "Add specialized certifications or recent project tech stacks",
          "Ensure consistent formatting for dates and locations"
        ],
        rawProfile: profile
      });
      setParsed(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMatch = async () => {
    if (!jd || !analysis) return;
    setMatching(true);
    try {
      const response = await axios.post('http://localhost:8000/match-jobs', {
        candidate_skills: analysis.skills,
        jobs: [{
          id: 'manual',
          skillsRequired: [], // Let the LLM/Semantic matcher handle it from description
          description: jd
        }]
      });

      if (response.data.success) {
        setMatchResult(response.data.matches[0]);
      }
    } catch (err) {
      console.error('Match failed:', err);
    } finally {
      setMatching(false);
    }
  };

  const removeFile = () => { 
    setFile(null); 
    setParsed(false); 
    setAnalysis(null); 
    setError(''); 
    setMatchResult(null);
  };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h1>AI Talent Optimizer</h1>
        <p>Advanced diagnostic system for skill extraction and career matching.</p>
      </div>

      <div className="resume-grid">
        {/* Left Column: Upload & Quick Match */}
        <div className="column">
          <div className="resume-panel">
            <h2><Upload size={20} /> Upload Knowledge Base</h2>
            {!file ? (
              <div
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
              >
                <input ref={inputRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />
                <div className="drop-icon"><Upload size={32} /></div>
                <p>Drop your latest Resume (PDF)</p>
                <span>Propels your profile with real-time AI analysis</span>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-info" style={{display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px'}}>
                  <FileText size={36} color="#6366f1" />
                  <div>
                    <p style={{fontWeight: 600, fontSize: '1rem'}}>{file.name}</p>
                    <span style={{color: '#888', fontSize: '0.8rem'}}>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button onClick={removeFile} style={{marginLeft: 'auto', background: 'none', border: 'none', color: '#888', cursor: 'pointer'}}><X size={18} /></button>
                </div>
              </div>
            )}

            {loading && (
              <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#888'}}>
                <div className="spinner" /> 
                <span style={{fontSize: '0.9rem'}}>Deciphering skills using Gemini LLM...</span>
              </div>
            )}
            {error && <div style={{color: '#ef4444', marginTop: '15px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem'}}>{error}</div>}
          </div>

          <div className="resume-panel" style={{marginTop: '30px'}}>
            <h2><Target size={20} /> Real-Time Job Match</h2>
            <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '20px'}}>Paste any Job Description to verify your compatibility score.</p>
            <textarea 
              className="jd-input" 
              rows="6" 
              placeholder="Paste Job Description here..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              disabled={!parsed}
            />
            <button 
              className="match-action-btn"
              disabled={!jd || !parsed || matching}
              onClick={handleQuickMatch}
            >
              {matching ? <div className="spinner" /> : <><Sparkles size={16} /> Analyze Compatibility</>}
            </button>

            {matchResult && (
              <div className="match-result-overlay">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 600}}>AI Match Score:</span>
                  <span style={{fontSize: '1.5rem', fontWeight: 800, color: matchResult.score > 75 ? '#10b981' : '#f59e0b'}}>{matchResult.score}%</span>
                </div>
                <div style={{marginTop: '10px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                   <div style={{width: `${matchResult.score}%`, height: '100%', background: matchResult.score > 75 ? '#10b981' : '#f59e0b', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="column">
          <div className="resume-panel">
            <h2><ShieldCheck size={20} /> Diagnostic Overview</h2>
            {parsed && analysis ? (
              <div className="score-container">
                <div className="strength-ring-wrap">
                  <svg viewBox="0 0 120 120" className="strength-ring">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" className="ring-bg" />
                    <circle 
                      cx="60" cy="60" r="54" 
                      className="ring-fill" 
                      strokeDasharray={`${(analysis.score / 100) * 339} 339`} 
                    />
                  </svg>
                  <div className="ring-center">
                    <span>{analysis.score}</span>
                    <small style={{color: '#888', fontWeight: 500}}>AI INDEX</small>
                  </div>
                </div>

                <div style={{textAlign: 'center', marginTop: '10px'}}>
                   <div style={{fontSize: '1.2rem', fontWeight: 700}}>{analysis.role}</div>
                   <div style={{color: '#888', fontSize: '0.9rem'}}>{analysis.experience} Profile</div>
                </div>

                <div className="skills-section" style={{width: '100%'}}>
                  <h3 style={{fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px'}}>
                    <Zap size={14} color="#10b981" /> Extracted Skill Intelligence
                  </h3>
                  <div className="skills-grid">
                    {analysis.skills.map((s, i) => (
                      <span key={i} className="skill-chip detected">
                        <CheckCircle size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '60px 0', color: '#555'}}>
                 <FileText size={48} style={{opacity: 0.2, marginBottom: '15px'}} />
                 <p>Upload a resume to initialize AI diagnostics.</p>
              </div>
            )}
          </div>

          <div className="resume-panel" style={{marginTop: '30px'}}>
             <h2><BookOpen size={20} /> Optimization Suggestions</h2>
             {parsed && analysis ? (
               <div className="tips-grid">
                 {analysis.tips.map((tip, i) => (
                   <div key={i} className="tip-card">
                      <div className="tip-icon"><ChevronRight size={16} /></div>
                      <div className="tip-content">
                        <h4>Recommendation #{i+1}</h4>
                        <p>{tip}</p>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div style={{textAlign: 'center', padding: '30px 20px', color: '#555'}}>
                 <Sparkles size={32} style={{opacity: 0.2, marginBottom: '12px'}} />
                 <p style={{fontSize: '0.9rem'}}>Initialize analysis to see AI recommendations.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
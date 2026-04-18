import { useState, useRef } from 'react';
import { 
  Upload, FileText, X, Zap, CheckCircle, 
  Target, Sparkles, BookOpen, 
  ShieldCheck, ChevronRight, Shield,
  Award, Briefcase, GraduationCap, Clock
} from 'lucide-react';
import axios from 'axios';
import './ResumeUpload.css';

const PARSING_STEPS = [
  { label: 'Extracting text from PDF', icon: FileText },
  { label: 'Analyzing skills with AI', icon: Zap },
  { label: 'Detecting experience & education', icon: GraduationCap },
  { label: 'Computing resume strength', icon: ShieldCheck },
  { label: 'Anonymizing for bias-free scoring', icon: Shield },
];

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [parsingStep, setParsingStep] = useState(0);
  
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

  const simulateSteps = () => {
    return new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setParsingStep(step);
        if (step >= PARSING_STEPS.length) {
          clearInterval(interval);
          resolve();
        }
      }, 600);
    });
  };

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setLoading(true);
    setParsed(false);
    setError('');
    setMatchResult(null);
    setParsingStep(0);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', f);

    try {
      // Start step animation in parallel with API call
      const [_, response] = await Promise.all([
        simulateSteps(),
        axios.post('http://localhost:8001/api/resumes/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      ]);

      const result = response.data.analysis;
      const profile = result?.profile || {};
      const detectedSkills = profile.skills || [];
      
      // Accept if we got skills OR if the upload succeeded
      if ((result && result.success) || detectedSkills.length > 0) {
        const finalScore = profile.resume_strength || 60;

        setAnalysis({
          skills: detectedSkills,
          score: finalScore,
          role: profile.role || 'Software Professional',
          experience: profile.experience_years ? `${profile.experience_years} years` : 'Entry-level',
          education_level: profile.education_level || 'Unknown',
          certifications: profile.certifications || [],
          education: profile.education || [],
          experience_list: profile.experience || [],
          tips: profile.tips || [
            "Include outcome-based bullet points (e.g., 'Reduced latency by 20%')",
            "Add specialized certifications or recent project tech stacks",
            "Ensure consistent formatting for dates and locations"
          ],
          source: result?.source || 'ai',
          biasReport: result?.biasReport || null
        });
        setParsed(true);
      } else {
        setError(result?.error || response.data?.message || 'Could not extract data from this PDF. Try a different format.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || err.message;
      if (msg.includes('Student profile not found')) {
        setError('Please complete your profile setup first, then try uploading again.');
      } else if (msg.includes('token') || msg.includes('401') || msg.includes('authorized')) {
        setError('Session expired. Please log out and log back in.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMatch = async () => {
    if (!jd || !analysis) return;
    setMatching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8001/api/resumes/match-job', {
        job_description: jd
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMatchResult(response.data);
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
    setParsingStep(0);
  };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h1>AI Talent Optimizer</h1>
        <p>Advanced diagnostic system for skill extraction and career matching.</p>
        {analysis?.source && (
          <div className="parser-badge">
            <Sparkles size={12} />
            Powered by {analysis.source === 'affinda' ? 'Affinda AI' : 'TalentSync NLP'}
          </div>
        )}
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

            {/* Parsing Steps Animation */}
            {loading && (
              <div className="parsing-steps">
                {PARSING_STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  const isComplete = i < parsingStep;
                  const isActive = i === parsingStep;
                  return (
                    <div key={i} className={`parsing-step ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="step-icon-wrap">
                        {isComplete ? <CheckCircle size={16} /> : <StepIcon size={16} />}
                      </div>
                      <span>{step.label}</span>
                      {isActive && <div className="step-spinner" />}
                    </div>
                  );
                })}
              </div>
            )}
            {error && <div style={{color: '#ef4444', marginTop: '15px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem'}}>{error}</div>}
          </div>

          {/* Quick Match Panel */}
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
                  <span style={{fontSize: '1.5rem', fontWeight: 800, color: matchResult.match_percent > 75 ? '#10b981' : '#f59e0b'}}>{matchResult.match_percent}%</span>
                </div>
                <div style={{marginTop: '10px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                   <div style={{width: `${matchResult.match_percent}%`, height: '100%', background: matchResult.match_percent > 75 ? '#10b981' : '#f59e0b', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                </div>
                {/* Score Breakdown */}
                <div className="match-breakdown">
                  <div className="breakdown-item">
                    <span>Skill Match</span>
                    <span className="breakdown-val">{matchResult.skill_score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Semantic Fit</span>
                    <span className="breakdown-val">{matchResult.semantic_score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Experience</span>
                    <span className="breakdown-val">{matchResult.exp_score}%</span>
                  </div>
                </div>
                {/* Matched / Missing Skills */}
                {matchResult.matched_skills?.length > 0 && (
                  <div style={{marginTop: '12px'}}>
                    <div className="skills-grid">
                      {matchResult.matched_skills.map((s, i) => (
                        <span key={i} className="skill-chip detected"><CheckCircle size={12} /> {s}</span>
                      ))}
                      {(matchResult.missing_skills || []).slice(0, 4).map((s, i) => (
                        <span key={`m-${i}`} className="skill-chip missing"><X size={12} /> {s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {matchResult.bias_free && (
                  <div className="bias-badge">
                    <Shield size={12} /> Bias-Free Score — AI never saw name, gender, or age
                  </div>
                )}
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
                   <div style={{color: '#888', fontSize: '0.9rem'}}>{analysis.experience} • {analysis.education_level}</div>
                </div>

                {/* Certifications */}
                {analysis.certifications.length > 0 && (
                  <div className="cert-section">
                    <h3 style={{fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
                      <Award size={14} color="#f59e0b" /> Certifications
                    </h3>
                    <div className="skills-grid">
                      {analysis.certifications.map((c, i) => (
                        <span key={i} className="skill-chip cert">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div className="skills-section" style={{width: '100%'}}>
                  <h3 style={{fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px'}}>
                    <Zap size={14} color="#10b981" /> Extracted Skill Intelligence ({analysis.skills.length})
                  </h3>
                  <div className="skills-grid">
                    {analysis.skills.map((s, i) => (
                      <span key={i} className="skill-chip detected">
                        <CheckCircle size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bias Report */}
                {analysis.biasReport && (
                  <div className="bias-report">
                    <Shield size={14} />
                    <span>{analysis.biasReport.message}</span>
                  </div>
                )}
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
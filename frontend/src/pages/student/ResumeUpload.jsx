import { useState, useRef } from 'react';
import { Upload, FileText, X, Zap, CheckCircle } from 'lucide-react';
import './ResumeUpload.css';

const PARSED_SKILLS = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'Git', 'REST APIs', 'CSS'];
const MISSING_SKILLS = ['Docker', 'GraphQL', 'AWS', 'Python'];

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleFile = (f) => {
    setFile(f);
    setTimeout(() => setParsed(true), 1200);
  };

  const removeFile = () => { setFile(null); setParsed(false); };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h1>My Resume</h1>
        <p>Upload your CV to enable AI-powered job matching and skill analysis.</p>
      </div>

      <div className="resume-grid">
        {/* Upload Zone */}
        <div className="resume-panel">
          <h2>Upload Resume</h2>
          {!file ? (
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e => handleFile(e.target.files[0])} />
              <div className="drop-icon"><Upload size={32} /></div>
              <p>Drag & drop your resume here</p>
              <span>or click to browse · PDF, DOC up to 5MB</span>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <FileText size={36} className="file-icon" />
                <div>
                  <p className="file-name">{file.name}</p>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button className="remove-btn" onClick={removeFile}><X size={16} /></button>
            </div>
          )}

          {file && !parsed && (
            <div className="parsing-indicator">
              <div className="spinner" />
              Analyzing your resume with AI…
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="resume-panel">
          <h2>Resume Strength</h2>
          {parsed ? (
            <>
              <div className="strength-ring-wrap">
                <svg viewBox="0 0 120 120" className="strength-ring">
                  <circle cx="60" cy="60" r="50" className="ring-bg" />
                  <circle cx="60" cy="60" r="50" className="ring-fill" strokeDasharray="267 314" />
                </svg>
                <div className="ring-center"><span>85</span><small>/ 100</small></div>
              </div>

              <div className="skills-section">
                <h3><Zap size={14} /> Detected Skills</h3>
                <div className="skills-grid">
                  {PARSED_SKILLS.map(s => (
                    <span key={s} className="skill-chip detected"><CheckCircle size={11} /> {s}</span>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h3>Recommended to Add</h3>
                <div className="skills-grid">
                  {MISSING_SKILLS.map(s => (
                    <span key={s} className="skill-chip missing">+ {s}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-analysis">
              <FileText size={36} />
              <p>Upload your resume to see AI-powered insights.</p>
            </div>
          )}
        </div>

        {/* Tips Panel */}
        <div className="resume-panel tips-panel">
          <h2>Optimization Tips</h2>
          <div className="tips-list">
            {[
              { tip: 'Use action verbs', detail: 'Start bullets with "Built", "Led", "Improved".' },
              { tip: 'Quantify achievements', detail: 'E.g. "Reduced load time by 40%".' },
              { tip: 'Keep it 1–2 pages', detail: 'Concise resumes get more reads.' },
              { tip: 'Match job keywords', detail: 'Mirror language from job descriptions.' },
              { tip: 'List tools & technologies', detail: 'Include specific frameworks and libraries.' },
            ].map(({ tip, detail }) => (
              <div key={tip} className="tip-card">
                <div className="tip-title">{tip}</div>
                <div className="tip-detail">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
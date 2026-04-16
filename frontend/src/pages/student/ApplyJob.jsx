import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, Upload, ChevronRight, Check } from 'lucide-react';
import './ApplyJob.css';

const MOCK_JOBS = {
  1: { title: 'Frontend Developer', company: 'Google', location: 'Remote', salary: '$95k – $130k', type: 'Full-time', tags: ['React', 'TypeScript', 'GraphQL'], description: 'Join our world-class engineering team to build products used by billions. You will work on cutting-edge web technologies and help shape the future of the web.' },
  2: { title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$140k – $180k', type: 'Full-time', tags: ['Python', 'PyTorch', 'LLMs'], description: 'Help us build safe and beneficial AI systems. You will work on training large language models and improving our alignment research infrastructure.' },
};

const DEFAULT_JOB = { title: 'Software Engineer', company: 'TalentSync Partner', location: 'Remote', salary: '$85k – $120k', type: 'Full-time', tags: ['JavaScript', 'React', 'Node.js'], description: 'An exciting opportunity to work on impactful products at a fast-growing tech company.' };

const STEPS = ['Personal Info', 'Resume & Skills', 'Cover Letter', 'Review & Submit'];

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = MOCK_JOBS[jobId] || DEFAULT_JOB;

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', coverLetter: '', fileName: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="apply-page">
        <div className="apply-success">
          <div className="success-icon"><Check size={32} /></div>
          <h2>Application Submitted!</h2>
          <p>Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been sent.</p>
          <p className="success-sub">You'll receive a confirmation email within 24 hours.</p>
          <div className="success-actions">
            <button className="back-btn" onClick={() => navigate('/dashboard/student/jobs')}>Back to Jobs</button>
            <button className="back-btn primary" onClick={() => navigate('/dashboard/student')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      {/* Header */}
      <div className="apply-header">
        <button className="back-link" onClick={() => navigate('/dashboard/student/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>
      </div>

      <div className="apply-layout">
        {/* Job Summary Card */}
        <div className="job-summary-card">
          <div className="job-summary-company">{job.company}</div>
          <h2 className="job-summary-title">{job.title}</h2>
          <div className="job-summary-meta">
            <span><MapPin size={13} /> {job.location}</span>
            <span><DollarSign size={13} /> {job.salary}</span>
            <span><Clock size={13} /> {job.type}</span>
            <span><Briefcase size={13} /> {job.tags[0]}</span>
          </div>
          <div className="job-summary-tags">
            {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <hr className="divider-line" />
          <h3>About the Role</h3>
          <p className="job-desc">{job.description}</p>
        </div>

        {/* Application Form */}
        <div className="apply-form-container">
          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((s, i) => (
              <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="step-circle">{i < step ? <Check size={12} /> : i + 1}</div>
                <span>{s}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="step-content">
            {step === 0 && (
              <div className="form-fields">
                <h3>Personal Information</h3>
                <div className="field-row">
                  <div className="field-group">
                    <label>Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="field-input" />
                  </div>
                  <div className="field-group">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="field-input" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="field-input" />
                  </div>
                  <div className="field-group">
                    <label>LinkedIn URL</label>
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/johndoe" className="field-input" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-fields">
                <h3>Resume & Skills</h3>
                <div className="upload-zone" onClick={() => setForm({ ...form, fileName: 'resume_john_doe.pdf' })}>
                  <Upload size={28} />
                  <p>{form.fileName || 'Click to upload your resume'}</p>
                  <span>PDF, DOC up to 5MB</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-fields">
                <h3>Cover Letter</h3>
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} role at ${job.company}...`}
                  className="field-textarea"
                  rows={12}
                />
              </div>
            )}

            {step === 3 && (
              <div className="form-fields">
                <h3>Review Your Application</h3>
                <div className="review-grid">
                  {[['Name', form.name || '—'], ['Email', form.email || '—'], ['Phone', form.phone || '—'], ['LinkedIn', form.linkedin || '—'], ['Resume', form.fileName || 'Not uploaded'], ['Cover Letter', form.coverLetter ? `${form.coverLetter.slice(0, 80)}…` : '—']].map(([k, v]) => (
                    <div key={k} className="review-row">
                      <span className="review-key">{k}</span>
                      <span className="review-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="step-nav">
            {step > 0 && (
              <button className="nav-btn" onClick={() => setStep(step - 1)}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="nav-btn primary" onClick={() => setStep(step + 1)}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="nav-btn primary" onClick={handleSubmit}>
                Submit Application <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
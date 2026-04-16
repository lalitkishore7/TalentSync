import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Clock, Calendar, 
  ArrowLeft, Share2, Bookmark, BookmarkCheck, Globe,
  ShieldCheck, Briefcase, GraduationCap, Award
} from 'lucide-react';
import './JobDetails.css';

// Mock data fetcher
const getJobData = (id) => ({
  id,
  title: 'Senior Frontend Engineer',
  company: 'MetaSystems',
  location: 'San Francisco, CA (Hybrid)',
  salary: '$140k – $180k',
  type: 'Full-time',
  posted: 'Posted 3 days ago',
  deadline: 'Ends in 12 days',
  category: 'Engineering',
  logo: null,
  verified: true,
  description: `We are looking for a Senior Frontend Engineer to lead our primary web application team. 
  You will be responsible for architecting and implementing high-performance UI components using 
  React, TypeScript, and modern state management patterns.`,
  requirements: [
    '5+ years of experience with React and modern JavaScript/TypeScript.',
    'Strong understanding of CSS-in-JS, Tailwind, or modern CSS modules.',
    'Experience architecting large-scale SPAs and optimizing performance.',
    'Excellent communication and leadership skills.'
  ],
  benefits: [
    'Competitive salary & equity package.',
    'Health, dental, and vision insurance.',
    'Unlimited PTO and flexible working hours.',
    'Professional development budget.'
  ],
  stats: {
    applicants: 42,
    views: 1205,
    matchScore: 94
  }
});

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setJob(getJobData(jobId));
  }, [jobId]);

  if (!job) return <div className="p-8">Loading job details...</div>;

  return (
    <div className="job-details-page">
      <div className="details-header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="header-actions">
          <button className="action-icon-btn"><Share2 size={18} /></button>
          <button 
            className={`action-icon-btn ${saved ? 'active' : ''}`}
            onClick={() => setSaved(!saved)}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      <div className="details-layout">
        <div className="details-main">
          {/* Hero Section */}
          <div className="details-hero panel-glass">
            <div className="hero-top">
              <div className="company-branding">
                <div className="detail-logo">
                  {job.logo ? <img src={job.logo} alt={job.company} /> : <Building2 size={32} />}
                </div>
                <div className="company-text">
                  <h3>{job.company} {job.verified && <ShieldCheck size={16} className="v-icon" />}</h3>
                  <a href="#" className="website-link"><Globe size={14} /> metasystems.inc</a>
                </div>
              </div>
              <div className="match-badge">
                <div className="match-value">{job.stats.matchScore}%</div>
                <div className="match-label">AI Match Score</div>
              </div>
            </div>

            <h1 className="job-title-large">{job.title}</h1>

            <div className="hero-meta-grid">
              <div className="meta-item">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <div className="meta-item">
                <DollarSign size={16} />
                <span>{job.salary}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{job.type}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{job.deadline}</span>
              </div>
            </div>

            <div className="hero-ctas">
              <button 
                className="btn-primary-large" 
                onClick={() => navigate(`/dashboard/student/apply/${jobId}`)}
              >
                Apply for this Position
              </button>
              <button className="btn-secondary-large">Save for Later</button>
            </div>
          </div>

          {/* Job Content */}
          <div className="content-section panel-glass">
            <h2>About this role</h2>
            <p className="description-text">{job.description}</p>
            
            <div className="requirements-section">
              <div className="section-header-icon">
                <GraduationCap size={20} />
                <h3>Key Requirements</h3>
              </div>
              <ul>
                {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </div>

            <div className="benefits-section">
              <div className="section-header-icon">
                <Award size={20} />
                <h3>Benefits</h3>
              </div>
              <div className="benefits-grid">
                {job.benefits.map((ben, i) => (
                  <div key={i} className="benefit-item">
                    <span className="check">✓</span> {ben}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="details-sidebar">
          <div className="stats-panel panel-glass">
            <h3>Job Activity</h3>
            <div className="stat-row">
              <span className="stat-label">Applicants</span>
              <span className="stat-value">{job.stats.applicants}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Views</span>
              <span className="stat-value">{job.stats.views}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Posted</span>
              <span className="stat-value">3 days ago</span>
            </div>
          </div>

          <div className="similar-jobs-panel panel-glass">
            <h3>Similar Roles</h3>
            <div className="mini-job-list">
              {[
                { t: 'Product Designer', c: 'Designly', s: '$120k' },
                { t: 'React Developer', c: 'CloudScale', s: '$135k' }
              ].map((j, i) => (
                <div key={i} className="mini-job-item">
                  <div className="mini-job-info">
                    <h4>{j.t}</h4>
                    <span>{j.c} • {j.s}</span>
                  </div>
                  <button className="mini-view-btn"><ArrowLeft size={14} style={{transform: 'rotate(180deg)'}} /></button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
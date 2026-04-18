import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Building2, ChevronRight, Search, Filter, Loader2, AlertCircle, CheckCircle2, XCircle, Timer, Briefcase } from 'lucide-react';
import axios from 'axios';
import './MyApplications.css';

const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'technical', label: 'Technical' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' }
];

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we always have an array
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Could not load your applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (stageId) => {
    const idx = STAGES.findIndex(s => s.id === stageId);
    return idx === -1 ? 0 : idx;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'rejected': return <XCircle size={14} />;
      case 'shortlisted': return <CheckCircle2 size={14} />;
      case 'hired': return <CheckCircle2 size={14} />;
      default: return <Timer size={14} />;
    }
  };

  const filtered = (applications || []).filter(app => {
    const title = app.job?.title || '';
    const company = app.job?.company?.companyName || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="dash-loading" style={{ height: '70vh' }}>
        <Loader2 className="animate-spin" size={32} />
        <p>Fetching your application status...</p>
      </div>
    );
  }

  return (
    <div className="my-apps-page">
      <div className="apps-header">
        <div>
          <h1>Application Tracker</h1>
          <p>Monitor your progress and interview stages in real-time.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search companies or roles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="icon-btn"><Filter size={16} /></button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="apps-list">
        {filtered.length > 0 ? (
          filtered.map((app) => (
            <div key={app._id} className="app-card">
              <div className="app-main-info">
                <div className="company-logo">
                  {app.job?.company?.companyName?.[0] || 'C'}
                </div>
                <div className="job-details">
                  <div className="company-name">{app.job?.company?.companyName}</div>
                  <h3 className="job-title">{app.job?.title}</h3>
                  <div className="job-meta">
                    <span><MapPin size={12} /> {app.job?.location}</span>
                    <span><Clock size={12} /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="app-status-wrap">
                  <span className={`status-tag ${app.status}`}>
                    {getStatusIcon(app.status)}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <button className="view-details-btn" onClick={() => navigate(`/dashboard/student/jobs/${app.job?._id}`)}>
                    View Job <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="pipeline-tracker">
                <div className="pipeline-line" />
                {STAGES.map((stage, idx) => {
                  const currentIdx = getStageIndex(app.stage);
                  const isCompleted = idx < currentIdx || (app.status === 'hired' && idx === STAGES.length - 1);
                  const isActive = idx === currentIdx && app.status !== 'rejected';
                  const isRejected = idx === currentIdx && app.status === 'rejected';

                  return (
                    <div key={stage.id} className={`pipeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isRejected ? 'rejected' : ''}`}>
                      <div className="step-node">
                        {isCompleted ? <CheckCircle2 size={16} /> : (idx + 1)}
                      </div>
                      <span className="step-label">{stage.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-apps">
            <div className="empty-icon"><Briefcase size={40} /></div>
            <h3>No applications found</h3>
            <p>You haven't applied to any jobs yet. Start exploring roles tailored to your skills!</p>
            <button className="cta-btn" onClick={() => navigate('/dashboard/student/jobs')}>Explore Jobs</button>
          </div>
        )}
      </div>
    </div>
  );
}

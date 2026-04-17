import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ShieldCheck, TrendingUp, ArrowRight, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../student/StudentDashboard.css';
import './CompanyDashboard.css';

const kpis = [
  { icon: Briefcase, label: 'Active Jobs', value: '5', delta: '2 expiring soon', color: '#6366f1' },
  { icon: Users, label: 'Total Applicants', value: '138', delta: '+24 this week', color: '#f59e0b' },
  { icon: ShieldCheck, label: 'Verification', value: 'Verified', delta: 'Government approved', color: '#10b981' },
  { icon: TrendingUp, label: 'Hire Rate', value: '18%', delta: 'Above industry avg', color: '#ff6b00' },
];

const recentApplicants = [
  { name: 'Priya Sharma', role: 'Frontend Developer', time: '1h ago', status: 'New', avatar: 'PS' },
  { name: 'James Wilson', role: 'ML Engineer', time: '3h ago', status: 'Reviewed', avatar: 'JW' },
  { name: 'Aisha Mohammed', role: 'Backend Engineer', time: '5h ago', status: 'Shortlisted', avatar: 'AM' },
  { name: 'Lucas Fernandez', role: 'UX Designer', time: '1d ago', status: 'Rejected', avatar: 'LF' },
];

const statusColors = { New: '#6366f1', Reviewed: '#f59e0b', Shortlisted: '#10b981', Rejected: '#ef4444' };

const activeJobs = [
  { title: 'Frontend Developer', applicants: 42, posted: '5 days ago', status: 'Active' },
  { title: 'ML Engineer', applicants: 29, posted: '1 week ago', status: 'Active' },
  { title: 'Backend Engineer', applicants: 67, posted: '2 weeks ago', status: 'Paused' },
];

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.name || 'Company';

  return (
    <div className="company-dash">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Welcome, <span className="name-accent">{name.split(' ')[0]}</span> 👋</h1>
          <p className="dash-subtitle">Here's your hiring pipeline overview for today.</p>
        </div>
        <button className="cta-btn" onClick={() => navigate('/dashboard/company/post-job')}>
          <Plus size={16} /> Post a Job
        </button>
      </div>

      <div className="kpi-row">
        {kpis.map(({ icon: Icon, label, value, delta, color }) => (
          <div className="kpi-tile" key={label}>
            <div className="kpi-icon" style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">{label}</span>
              <span className="kpi-value">{value}</span>
              <span className="kpi-delta">{delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Recent Applicants */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>Recent Applicants</h2>
            <button className="panel-link" onClick={() => navigate('/dashboard/company/manage-jobs')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="activity-list">
            {recentApplicants.map(a => (
              <div key={a.name} className="activity-item">
                <div className="activity-logo" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {a.avatar}
                </div>
                <div className="activity-info">
                  <span className="activity-role">{a.name}</span>
                  <span className="activity-company">{a.role}</span>
                </div>
                <div className="activity-right">
                  <span className="activity-status" style={{ color: statusColors[a.status], background: `${statusColors[a.status]}18` }}>
                    {a.status}
                  </span>
                  <span className="activity-time"><Clock size={11} /> {a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>Active Postings</h2>
            <button className="panel-link" onClick={() => navigate('/dashboard/company/manage-jobs')}>
              Manage <ArrowRight size={14} />
            </button>
          </div>
          <div className="job-listing-list">
            {activeJobs.map(j => (
              <div key={j.title} className="job-listing-row">
                <div>
                  <p className="jl-title">{j.title}</p>
                  <p className="jl-meta">{j.applicants} applicants · {j.posted}</p>
                </div>
                <span className={`jl-status ${j.status === 'Active' ? 'active' : 'paused'}`}>{j.status}</span>
              </div>
            ))}
          </div>
          <button className="cta-btn secondary" onClick={() => navigate('/dashboard/company/post-job')}>
            <Plus size={14} /> Post New Job
          </button>
        </div>
      </div>
    </div>
  );
}
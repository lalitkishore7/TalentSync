import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, Eye, TrendingUp, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './StudentDashboard.css';

const kpis = [
  { icon: Briefcase, label: 'Matched Jobs', value: '24', delta: '+3 this week', type: 'blue' },
  { icon: Send, label: 'Applications Sent', value: '7', delta: '2 pending review', type: 'orange' },
  { icon: Eye, label: 'Profile Views', value: '142', delta: '+18 today', type: 'green' },
  { icon: TrendingUp, label: 'Match Score', value: '87%', delta: 'Top 10%', type: 'purple' },
];

const recentActivity = [
  { company: 'Google', role: 'SWE Intern', status: 'Applied', time: '2h ago', color: '#4285F4' },
  { company: 'Microsoft', role: 'Data Analyst', status: 'Viewed', time: '1d ago', color: '#00A4EF' },
  { company: 'Stripe', role: 'Frontend Engineer', status: 'Saved', time: '2d ago', color: '#635BFF' },
  { company: 'Notion', role: 'Product Manager', status: 'Applied', time: '3d ago', color: '#000000' },
];

const statusColor = { Applied: '#f59e0b', Viewed: '#6366f1', Saved: '#10b981' };

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.name || 'there';

  return (
    <div className="student-dash">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Welcome back, <span className="name-accent">{name.split(' ')[0]}</span> 👋</h1>
          <p className="dash-subtitle">Here's your career snapshot for today.</p>
        </div>
        <button className="cta-btn" onClick={() => navigate('/dashboard/student/jobs')}>
          <Sparkles size={16} /> Explore AI Matches
        </button>
      </div>

      {/* KPI Grid */}
      <div className="kpi-row">
        {kpis.map(({ icon: Icon, label, value, delta, type }) => (
          <div className={`kpi-tile ${type}`} key={label}>
            <div className="kpi-icon">
              <Icon size={24} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">{label}</span>
              <span className="kpi-value">{value}</span>
              <span className="kpi-delta">{delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="dash-grid">
        {/* Recent Activity */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>Recent Activity</h2>
            <button className="panel-link" onClick={() => navigate('/dashboard/student/jobs')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.role} className="activity-item">
                <div className="activity-logo" style={{ background: `${item.color}22`, color: item.color }}>
                  {item.company[0]}
                </div>
                <div className="activity-info">
                  <span className="activity-role">{item.role}</span>
                  <span className="activity-company">{item.company}</span>
                </div>
                <div className="activity-right">
                  <span className="activity-status" style={{ color: statusColor[item.status], background: `${statusColor[item.status]}18` }}>
                    {item.status}
                  </span>
                  <span className="activity-time"><Clock size={11} /> {item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>Profile Strength</h2>
            <span className="strength-score">72%</span>
          </div>
          <div className="strength-bar-bg">
            <div className="strength-bar-fill" style={{ width: '72%' }} />
          </div>
          <div className="profile-tips">
            {[
              { done: true, label: 'Email verified' },
              { done: true, label: 'Profile photo added' },
              { done: false, label: 'Upload your resume' },
              { done: false, label: 'Add 3+ skills' },
              { done: false, label: 'Complete education history' },
            ].map(({ done, label }) => (
              <div key={label} className={`tip-item ${done ? 'done' : ''}`}>
                <span className="tip-dot">{done ? '✓' : '○'}</span>
                {label}
              </div>
            ))}
          </div>
          <button className="cta-btn secondary" style={{ marginTop: 16 }} onClick={() => navigate('/dashboard/student/profile')}>
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './VerificationStatus.css';

const STATUS_CONFIG = {
  verified: { 
    icon: ShieldCheck, 
    label: 'Government Verified', 
    color: '#10b981', 
    bg: 'rgba(16,185,129,0.08)', 
    border: 'rgba(16,185,129,0.2)', 
    msg: 'Your company has been successfully verified. You can now post unlimited jobs and access all platform features.' 
  },
  pending: { 
    icon: Clock, 
    label: 'Under Review', 
    color: '#f59e0b', 
    bg: 'rgba(245,158,11,0.08)', 
    border: 'rgba(245,158,11,0.2)', 
    msg: 'Your verification documents are being reviewed by government authorities. This typically takes 2–5 business days.' 
  },
  rejected: { 
    icon: AlertCircle, 
    label: 'Verification Rejected', 
    color: '#ef4444', 
    bg: 'rgba(239,68,68,0.08)', 
    border: 'rgba(239,68,68,0.2)', 
    msg: 'Your verification was rejected. Please review the reasons below and resubmit updated documents.' 
  },
};

export default function VerificationStatus({ forcedPending = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use user's status, but allow override for onboarding preview
  const status = forcedPending ? 'pending' : (user?.isVerified ? 'verified' : 'pending');
  
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  const timeline = [
    { label: 'Application Submitted', date: 'Today', done: true },
    { label: 'Documents Uploaded', date: 'Today', done: true },
    { label: 'Government Review', date: 'Estimated: 2-3 days', done: false },
    { label: 'Final Approval', date: 'Pending', done: false },
  ];

  return (
    <div className="vs-page">
      <div className="vs-header">
        {forcedPending && (
          <div className="onboarding-success">
            <CheckCircle2 size={24} />
            <span>Registration Complete! Your application is now in the queue.</span>
          </div>
        )}
        <h1>Verification Status</h1>
        <p>Government verification allows you to post unlimited jobs and builds trust with candidates.</p>
      </div>

      {/* Status Card */}
      <div className="status-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
        <div className="status-icon" style={{ color: cfg.color, background: `${cfg.color}18` }}>
          <Icon size={32} />
        </div>
        <div className="status-text">
          <h2 style={{ color: cfg.color }}>{cfg.label}</h2>
          <p>{cfg.msg}</p>
        </div>
      </div>

      <div className="vs-layout-grid">
        {/* Timeline */}
        <div className="vs-panel">
          <h3>Verification Timeline</h3>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={item.label} className={`timeline-item ${item.done ? 'done' : ''}`}>
                <div className="tl-dot" />
                {i < timeline.length - 1 && <div className="tl-line" />}
                <div className="tl-content">
                  <span className="tl-label">{item.label}</span>
                  <span className="tl-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="vs-panel">
          <h3>Why get verified?</h3>
          <div className="benefits-list-mini">
            {[
              { emoji: '✅', title: 'Unlimited Job Posts' },
              { emoji: '🔍', title: 'Priority Search Ranking' },
              { emoji: '🛡️', title: 'Trust Badge' },
              { emoji: '📊', title: 'Advanced Analytics' }
            ].map((b) => (
              <div key={b.title} className="benefit-mini-item">
                <span className="b-emoji">{b.emoji}</span>
                <span>{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {status === 'rejected' && (
        <button className="start-verify-btn" onClick={() => navigate('/dashboard/company/verify-form')}>
          Resubmit Documents <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
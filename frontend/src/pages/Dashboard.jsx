import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, Home, Briefcase, FileText, Settings, User, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const isStudent = role === 'student';

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          TalentSync <span>{isStudent ? 'Student' : 'Company'}</span>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="side-nav-item active"><Home size={18} /> Overview</a>
          {isStudent ? (
            <>
              <a href="#" className="side-nav-item"><Briefcase size={18} /> AI Job Matches</a>
              <a href="#" className="side-nav-item"><FileText size={18} /> My Resume</a>
              <a href="#" className="side-nav-item"><User size={18} /> Applications</a>
            </>
          ) : (
            <>
              <a href="#" className="side-nav-item"><Briefcase size={18} /> Active Postings</a>
              <a href="#" className="side-nav-item"><User size={18} /> Candidates</a>
              <a href="#" className="side-nav-item"><ShieldCheck size={18} /> Verification Status</a>
            </>
          )}
          <a href="#" className="side-nav-item"><Settings size={18} /> Settings</a>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {isStudent ? 'Student' : 'Company'}</h1>
          <p className="subtitle">Here is what's happening with your {isStudent ? 'applications' : 'hiring pipeline'} today.</p>
        </header>

        <section className="dashboard-content">
          {/* Mock KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>{isStudent ? 'Matched Jobs' : 'Active Jobs'}</h3>
              <div className="kpi-value">{isStudent ? '14' : '3'}</div>
            </div>
            <div className="kpi-card">
              <h3>{isStudent ? 'Applications Sent' : 'Total Applicants'}</h3>
              <div className="kpi-value">{isStudent ? '5' : '42'}</div>
            </div>
            <div className="kpi-card">
              <h3>{isStudent ? 'Profile Views' : 'Govt Verification'}</h3>
              <div className="kpi-value highlight">{isStudent ? '28' : 'Verified'}</div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="dashboard-panel">
            <h2>{isStudent ? 'Top AI Recommendations' : 'Recent Applications'}</h2>
            <div className="empty-state">
              <p>Nothing strictly matched right this second. Check back later!</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

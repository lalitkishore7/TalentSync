import { LogOut, Home, Briefcase, FileText, Settings, User, ShieldCheck } from 'lucide-react';

export default function Sidebar({ isStudent, handleLogout }) {
  return (
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
  );
}

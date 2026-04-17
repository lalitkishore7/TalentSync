import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, Home, Briefcase, FileText, BookmarkCheck, 
  Newspaper, User, Settings, ShieldCheck, PlusCircle, 
  Users, Building2, Clock, PanelLeftClose, PanelLeftOpen,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ isStudent, handleLogout, role, isVerified, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const studentLinks = [
    { icon: Home, label: 'Overview', path: '' },
    { icon: Briefcase, label: 'AI Job Matches', path: 'jobs' },
    { icon: FileText, label: 'My Resume', path: 'resume' },
    { icon: BookmarkCheck, label: 'Saved Jobs', path: 'saved' },
    { icon: Newspaper, label: 'IT News', path: 'news' },
    { icon: User, label: 'My Profile', path: 'profile' },
  ];

  const companyLinks = [
    { icon: Home, label: 'Overview', path: '' },
    { icon: PlusCircle, label: 'Post a Job', path: 'post-job' },
    { icon: Briefcase, label: 'Manage Jobs', path: 'manage-jobs' },
    { icon: Users, label: 'Candidates', path: 'candidates' },
    { icon: ShieldCheck, label: 'Verification', path: 'verification' },
    { icon: Building2, label: 'Company Profile', path: 'profile' },
  ];

  const restrictedCompanyLinks = [
    { icon: ShieldCheck, label: 'Verification Status', path: 'verification' },
  ];

  const links = isStudent 
    ? studentLinks 
    : (isVerified ? companyLinks : restrictedCompanyLinks);

  const basePath = `/dashboard/${role}`;

  const isActive = (path) => {
    const fullPath = path ? `${basePath}/${path}` : basePath;
    const currentFullPath = location.pathname + location.search;
    
    if (path === '') return location.pathname === basePath || location.pathname === `${basePath}/`;
    
    if (path === 'profile' && currentFullPath.includes('tab=settings')) {
      return false;
    }

    return currentFullPath.startsWith(fullPath);
  };

  const handleNav = (path) => {
    navigate(path ? `${basePath}/${path}` : basePath);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            TalentSync
            <span>{isStudent ? 'Student' : 'Company'}</span>
          </div>
        )}
        <button 
          className="collapse-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            className={`side-nav-item ${isActive(path) ? 'active' : ''}`}
            onClick={() => handleNav(path)}
            title={isCollapsed ? label : ''}
          >
            <div className="icon-wrapper">
              <Icon size={20} />
            </div>
            {!isCollapsed && <span className="label">{label}</span>}
            {isCollapsed && isActive(path) && <div className="active-indicator" />}
          </button>
        ))}

        {isVerified && (
          <button 
            className={`side-nav-item ${isActive('profile?tab=settings') ? 'active' : ''}`} 
            onClick={() => navigate(`/dashboard/${role}/profile?tab=settings`)}
            title={isCollapsed ? "Settings" : ""}
          >
            <div className="icon-wrapper">
              <Settings size={20} />
            </div>
            {!isCollapsed && <span className="label">Settings</span>}
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        <button className="logout-btn" onClick={handleLogout} title={isCollapsed ? "Sign Out" : ""}>
          <div className="icon-wrapper">
            <LogOut size={20} />
          </div>
          {!isCollapsed && <span className="label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}


import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, Home, Briefcase, FileText, BookmarkCheck, 
  Newspaper, User, Settings, ShieldCheck, PlusCircle, 
  Users, Building2, Clock
} from 'lucide-react';

export default function Sidebar({ isStudent, handleLogout, role, isVerified }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Restricted links for unverified companies
  const restrictedCompanyLinks = [
    { icon: ShieldCheck, label: 'Verification Status', path: 'verification' },
  ];

  const links = isStudent 
    ? studentLinks 
    : (isVerified ? companyLinks : restrictedCompanyLinks);

  const basePath = `/dashboard/${role}`;

  const isActive = (path) => {
    const [pathOnly, searchOnly] = path.split('?');
    const fullPath = pathOnly ? `${basePath}/${pathOnly}` : basePath;
    
    // If it's the home link
    if (path === '') {
      return location.pathname === basePath || location.pathname === `${basePath}/`;
    }

    // Check pathname match
    const pathMatch = location.pathname.startsWith(fullPath);
    
    // If link has a query param, it must also match
    if (searchOnly) {
      return pathMatch && location.search.includes(searchOnly);
    }
    
    // If current location has a query param but the link doesn't, 
    // it's not a match (to distinguish Profile vs Settings)
    if (location.search && !searchOnly && pathOnly === 'profile') {
      return false;
    }

    return pathMatch;
  };

  const handleNav = (path) => {
    navigate(path ? `${basePath}/${path}` : basePath);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        TalentSync
        <span>{isStudent ? 'Student Portal' : 'Company Portal'}</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            className={`side-nav-item ${isActive(path) ? 'active' : ''}`}
            onClick={() => handleNav(path)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

        {isVerified && (
          <button className="side-nav-item" onClick={() => navigate(`/dashboard/${role}/profile?tab=settings`)}>
            <Settings size={18} />
            Settings
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        {(!isStudent && !isVerified) && (
          <div className="pending-badge">
            <Clock size={12} /> Pending Verification
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

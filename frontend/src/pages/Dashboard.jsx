import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import VerificationStatus from './company/VerificationStatus';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard({ role }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isStudent = role === 'student';
  const isVerified = user?.isVerified !== false;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(`/dashboard/${role}/${path}`);
  };

  return (
    <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
      <Sidebar 
        isStudent={isStudent} 
        handleLogout={handleLogout} 
        onNavigate={handleNavigate} 
        role={role} 
        isVerified={isVerified}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="dashboard-main">
        <div className="main-content-wrapper">
          {!isStudent && !isVerified ? (
            <VerificationStatus forcedPending={true} />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}


import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import VerificationStatus from './company/VerificationStatus';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard({ role }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isStudent = role === 'student';
  const isVerified = user?.isVerified !== false; // Students are true, companies might be false

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(`/dashboard/${role}/${path}`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isStudent={isStudent} handleLogout={handleLogout} onNavigate={handleNavigate} role={role} isVerified={isVerified} />
      <main className="dashboard-main">
        {!isStudent && !isVerified ? (
          <VerificationStatus forcedPending={true} />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

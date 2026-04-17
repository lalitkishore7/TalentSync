import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RoleSelectionModal.css';

export default function RoleSelectionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSelectRole = (role) => {
    onClose();
    navigate(`/login/${role}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="modal-content glass-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
            
            <h2 className="modal-title">Join TalentSync</h2>
            <p className="modal-subtitle">Select your role to continue</p>
            
            <div className="role-cards">
              <div className="role-card student-card" onClick={() => handleSelectRole('student')}>
                <div className="role-icon-wrapper"><GraduationCap size={32} /></div>
                <h3>Student Portal</h3>
                <p>Find verified internships & jobs matching your career goals.</p>
              </div>

              <div className="role-card company-card" onClick={() => handleSelectRole('company')}>
                <div className="role-icon-wrapper"><Building2 size={32} /></div>
                <h3>Company Portal</h3>
                <p>Hire top talent securely with automated verification.</p>
              </div>
            </div>


          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

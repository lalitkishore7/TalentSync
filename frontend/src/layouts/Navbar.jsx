import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Navbar({ setIsModalOpen }) {
  return (
    <motion.nav className="navbar" variants={navVariants}>
      <div className="nav-left">
        <div className="logo" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Shield className="logo-icon" size={28} style={{ marginRight: '8px' }} />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            TalentSync
          </motion.span>
        </div>
      </div>

      <div className="nav-center"></div>

      <div className="nav-right">
        <motion.button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}

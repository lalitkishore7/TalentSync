import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import '../App.css';

// Animation variants for smooth entering orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // cascades the children animations
      delayChildren: 0.1
    }
  }
};

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const stripeVariants = {
  hidden: { scaleY: 0, transformOrigin: "bottom" },
  visible: (custom) => ({
    scaleY: 1,
    transition: { delay: custom * 0.1, duration: 1.5, ease: "easeInOut" }
  })
};

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background ambient glow */}
        <motion.div 
          className="ambient-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Background Vertical Stripes - Animating vertically! */}
        <div className="bg-stripes">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i} 
              className="stripe"
              custom={i}
              variants={stripeVariants}
            />
          ))}
        </div>

        {/* Navbar */}
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

        {/* Main Hero Content */}
        <main className="hero-content">
          <motion.h1 
            className="hero-title"
            variants={itemVariants}
          >
            Trusted Opportunities. <br/>
            <span className="elegant-italic">Smarter Careers.</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            variants={itemVariants}
          >
            A secure recruitment platform where only verified companies can hire students, 
            powered by <span className="text-gradient">AI, ML, and automated government verification.</span>
          </motion.p>
        </main>
      </motion.div>

      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

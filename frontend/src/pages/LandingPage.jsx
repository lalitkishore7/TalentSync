import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import '../App.css';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="hero-container">
        {/* Background ambient glow */}
        <div className="ambient-glow"></div>
        
        {/* Vertical Stripes matching StartupSprint reference */}
        <div className="bg-stripes">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="stripe"></div>
          ))}
        </div>

        {/* Navbar */}
        <nav className="navbar animate-fade-in delay-1">
          <div className="nav-left">
            <div className="logo">
              <Shield className="logo-icon" size={28} />
              TalentSync
            </div>
          </div>
          
          <div className="nav-center"></div>
          
          <div className="nav-right">
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Get Started
            </button>
          </div>
        </nav>

        {/* Main Hero Content */}
        <main className="hero-content">
          <motion.h1 
            className="hero-title animate-fade-in delay-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Trusted Opportunities. <br/>
            <span className="elegant-italic">Smarter Careers.</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle animate-fade-in delay-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            A secure recruitment platform where only verified companies can hire students, 
            powered by <span className="text-gradient">AI, ML, and automated government verification.</span>
          </motion.p>
        </main>
      </div>

      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

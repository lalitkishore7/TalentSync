import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Shield, Users, CheckCircle, Zap, MessageSquare, Mail, ChevronDown, Play, ArrowRight } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../layouts/Navbar';
import '../App.css';

const revealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Section = ({ id, children, className }) => (
  <motion.section
    id={id}
    className={`landing-section ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={revealVariants}
  >
    {children}
  </motion.section>
);

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme('dark');
    return () => setTheme(savedTheme);
  }, [setTheme]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="landing-page-root dark">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      <div className="hero-container-vetra">
        <div className="vetra-bg-arc"></div>

        <Navbar setIsModalOpen={setIsModalOpen} />

        <main className="hero-content-vetra">
          {/* Badge removed as requested */}

          <motion.h1
            className="vetra-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted Opportunities <br />
            <span className="elegant-italic">Smarter Careers.</span>
          </motion.h1>

          <motion.p
            className="vetra-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI-driven recruitment & insights. Empower your future, connect with verified companies, and maximize your potential effortlessly.
          </motion.p>

          <motion.div 
            className="vetra-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="btn-vetra-solid" onClick={() => setIsModalOpen(true)}>
              Get started for free
            </button>
          </motion.div>

          <motion.div 
            className="vetra-trusted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Trusted by 200+ companies</p>
            <div className="trusted-logos">
              <span><Shield size={16}/> FeatherDev</span>
              <span><Zap size={16}/> Boltshift</span>
              <span><CheckCircle size={16}/> GlobalBank</span>
              <span><Users size={16}/> Lightbox</span>
            </div>
          </motion.div>
        </main>
      </div>

      <Section id="about" className="about-section">
        <div className="section-header">
          <span className="section-badge">ABOUT US</span>
          <h2>Getting to know TalentSync</h2>
          <p>We are more than just a recruitment platform; we are your trusted partner in navigating the complexities of your career.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card orange">
            <div className="stat-icon"><Users size={24} /></div>
            <div className="stat-value"><span>100K USERS</span></div>
            <p>TalentSync rapidly attracting a substantial user base of over 500,000 students within its first year.</p>
          </div>
          <div className="stat-card black">
            <div className="stat-icon"><Zap size={24} /></div>
            <div className="stat-value"><span>98%</span></div>
            <p>Users enjoy faster match rates and automated verification processing time.</p>
          </div>
          <div className="stat-card gray">
            <div className="stat-icon"><Shield size={24} /></div>
            <div className="stat-value"> <span>10K COMPANIES</span></div>
            <p>A network of over 24,000 verified partner companies worldwide.</p>
          </div>
        </div>
      </Section>

      <Section id="features" className="features-section">
        <div className="features-container">
          <div className="features-text">
            <span className="section-badge">FEATURES</span>
            <h2>All-in-one platform for your future</h2>
            <p>Simplify your career search by securely connecting with verified companies and automated matching.</p>
            
            <div className="features-list">
              {[
                { id: '01', title: 'Secure and Easy Verification', desc: 'Government-backed automated verification for all companies.' },
                { id: '02', title: 'AI-Powered Job Matching', desc: 'Smarter recommendations based on your unique skills and profile.' },
                { id: '03', title: 'Real-Time Application Tracking', desc: 'Monitor your progress from application to offer in one place.' }
              ].map(f => (
                <div key={f.id} className="feature-item">
                  <span className="feature-id">{f.id}</span>
                  <div className="feature-info">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual box removed as requested */}
        </div>
      </Section>

      <Section id="faqs" className="faq-section">
        <span className="section-badge">FAQs</span>
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: "Is TalentSync free for students?", a: "Yes, TalentSync is completely free for all students looking for opportunities." },
            { q: "How does AI matching work?", a: "Our AI analyzes your skills, experience, and preferences to match you with the best roles." },
            { q: "Are all companies verified?", a: "Yes, we use government data and automated checks to ensure 100% verification." },
            { q: "Can I track my applications?", a: "Absolutely. Your dashboard provides real-time updates on every application." }
          ].map((item, i) => (
            <div key={i} className="faq-card">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Let's build your future together</h2>
            <p>Have questions? Our team is here to help you get started.</p>
            <div className="contact-methods">
              <div className="method">
                <Mail size={20} />
                <span>support@talentsync.com</span>
              </div>
              <div className="method">
                <MessageSquare size={20} />
                <span>Live Chat Support</span>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <textarea placeholder="How can we help?" rows={4}></textarea>
            </div>
            <button className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>
      </Section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Shield size={24} className="logo-icon" />
            <span>TalentSync</span>
          </div>
          <p>© 2026 TalentSync. All rights reserved.</p>
        </div>
      </footer>

      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

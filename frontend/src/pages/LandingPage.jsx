import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Shield, Users, CheckCircle, Zap, MessageSquare, Mail, ChevronDown, Play, ArrowRight, Sparkles, Building2, Briefcase } from 'lucide-react';
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import RoleSelectionModal from '../components/RoleSelectionModal';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../layouts/Navbar';
import FadeUp from '../components/animations/FadeUp';
import Stagger from '../components/animations/Stagger';
import StaggerItem from '../components/animations/StaggerItem';
import '../App.css';

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
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
  const [activeFaq, setActiveFaq] = useState(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
    return () => setTheme(localStorage.getItem('theme') || 'dark');
  }, [setTheme]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="landing-page-root dark">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      {/* Background Animated Orbs */}
      <div className="bg-orbs-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <Navbar setIsModalOpen={setIsModalOpen} />

      {/* Floating UI Elements */}
      <motion.div className="floating-element float-1" animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="glass-pill"><Sparkles size={16} /> AI Matched</div>
      </motion.div>
      <motion.div className="floating-element float-2" animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <div className="glass-pill"><Building2 size={16} /> Verified Top Companies</div>
      </motion.div>
      <motion.div className="floating-element float-3" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="glass-pill"><Briefcase size={16} /> Seamless Hiring</div>
      </motion.div>

      {/* Fixed Hero Section */}
      <motion.div className="hero-sticky-container" style={{ opacity, scale }}>
        <div className="hero-glow-base" />
        
        <main className="hero-content-vetra">

          <motion.h1
            className="vetra-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Unlock Your Potential with<br />
            <span className="text-gradient-modern">TalentSync.</span>
          </motion.h1>

          <motion.p
            className="vetra-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Experience AI-driven recruitment. Empower your future, connect securely with verified top-tier companies, and discover roles that match your unique skills.
          </motion.p>

          <motion.div 
            className="hero-actions-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="btn-get-started-hero" onClick={() => setIsModalOpen(true)}>
              Launch Platform <ArrowRight size={18} className="btn-icon-right"/>
            </button>
            <button className="btn-secondary-hero" onClick={() => { document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>
              Learn More
            </button>
          </motion.div>
        </main>
      </motion.div>

      {/* Content Wrapper that scrolls over the Hero */}
      <div className="content-wrapper-next">
        <Section id="about" className="about-section glass-section">
          <FadeUp>
            <div className="section-header">
              <span className="section-badge-modern"><Users size={14}/> About Us</span>
              <h2>Redefining the Hiring Landscape</h2>
              <p>We combine advanced AI matching with uncompromising verification to create the ultimate career launchpad.</p>
            </div>
          </FadeUp>
          
          <div className="stats-grid">
            <motion.div className="stat-card glass-card hover-glow" variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="stat-icon-wrapper orange-glow"><Users size={28} /></div>
              <div className="stat-value text-gradient-modern">100K+</div>
              <div className="stat-label">Active Users</div>
              <p>Join a rapidly growing community of professionals and students.</p>
            </motion.div>
            <motion.div className="stat-card glass-card hover-glow" variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="stat-icon-wrapper blue-glow"><Zap size={28} /></div>
              <div className="stat-value text-gradient-blue">98%</div>
              <div className="stat-label">Match Accuracy</div>
              <p>Our advanced ML algorithms ensure you find the perfect role faster.</p>
            </motion.div>
            <motion.div className="stat-card glass-card hover-glow" variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="stat-icon-wrapper green-glow"><Shield size={28} /></div>
              <div className="stat-value text-gradient-green">10K+</div>
              <div className="stat-label">Verified Companies</div>
              <p>Connect securely with government-verified partners worldwide.</p>
            </motion.div>
          </div>
        </Section>

        <Section id="features" className="features-section">
          <div className="features-container">
            <FadeUp>
              <div className="section-header">
                <span className="section-badge-modern"><Sparkles size={14}/> Platform Features</span>
                <h2>Everything you need to succeed</h2>
                <p>A unified platform designed for efficiency, security, and precision.</p>
              </div>
            </FadeUp>
            
            <Stagger>
              <div className="features-grid-modern">
                {[
                  { id: '01', title: 'Intelligent AI Matching', desc: 'Smarter recommendations based on your unique skills, resume, and experience.', icon: <Zap size={24}/> },
                  { id: '02', title: 'Secure Verification', desc: 'Government-backed automated verification for companies to eliminate scams.', icon: <Shield size={24}/> },
                  { id: '03', title: 'Seamless Tracking', desc: 'Monitor your progress from initial application to final offer in one place.', icon: <CheckCircle size={24}/> },
                  { id: '04', title: 'Direct Communication', desc: 'Connect instantly with recruiters and hiring managers without middlemen.', icon: <MessageSquare size={24}/> }
                ].map((f, idx) => (
                  <StaggerItem key={f.id}>
                    <div className="feature-card-modern glass-card">
                      <div className="feature-card-header">
                        <div className="feature-icon-circle">{f.icon}</div>
                        <span className="feature-id-modern">{f.id}</span>
                      </div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          </div>
        </Section>

        <Section id="faqs" className="faq-section glass-section">
          <FadeUp>
            <div className="section-header">
              <span className="section-badge-modern"><MessageSquare size={14}/> FAQs</span>
              <h2>Common Questions</h2>
            </div>
          </FadeUp>
          <Stagger>
            <div className="faq-grid-modern">
              {[
                { q: "Is TalentSync free for students?", a: "Yes! TalentSync is completely free for all students and job seekers looking for opportunities." },
                { q: "How does the AI matching work?", a: "Our ML service analyzes your parsed resume, skills, and experience, comparing them against job requirements using TF-IDF and semantic matching to find the best fit." },
                { q: "Are all companies verified?", a: "Yes. We mandate automated government-backed verification checks to ensure 100% authenticity and safety." },
                { q: "Can I track my applications in real-time?", a: "Absolutely. Your dashboard provides live status updates on every application you submit." }
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div 
                    className={`faq-card-modern glass-card ${activeFaq === i ? 'active' : ''}`}
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <div className="faq-question-modern">
                      <h4>{item.q}</h4>
                      <motion.div 
                        animate={{ rotate: activeFaq === i ? 180 : 0 }}
                        className="faq-chevron"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                    <motion.div 
                      className="faq-answer-modern"
                      initial={false}
                      animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </Section>

        <Section id="contact" className="contact-section">
          <div className="contact-container-modern glass-card">
            <div className="contact-info-modern">
              <h2>Let's build your future</h2>
              <p>Ready to get started or have questions? Our team is here to assist you.</p>
              <div className="contact-methods-modern">
                <div className="method-modern">
                  <div className="method-icon"><Mail size={20} /></div>
                  <span>support@talentsync.com</span>
                </div>
                <div className="method-modern">
                  <div className="method-icon"><MessageSquare size={20} /></div>
                  <span>Live Chat Support</span>
                </div>
              </div>
            </div>
            <form className="contact-form-modern" onSubmit={e => e.preventDefault()}>
              <div className="form-group-modern">
                <input type="text" placeholder="Full Name" required/>
              </div>
              <div className="form-group-modern">
                <input type="email" placeholder="Email Address" required/>
              </div>
              <div className="form-group-modern">
                <textarea placeholder="How can we help?" rows={4} required></textarea>
              </div>
              <button className="btn-submit-modern">Send Message <ArrowRight size={16}/></button>
            </form>
          </div>
        </Section>

        <footer className="landing-footer-modern">
          <div className="footer-content-modern">
            <div className="footer-logo-modern">
              <Shield size={24} className="logo-icon-v" />
              <span>TalentSync</span>
            </div>
            <div className="footer-socials">
              <a href="#" className="social-link"><FaGithub size={20}/></a>
              <a href="#" className="social-link"><FaTwitter size={20}/></a>
              <a href="#" className="social-link"><FaLinkedin size={20}/></a>
            </div>
            <p className="footer-copyright">© 2026 TalentSync. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

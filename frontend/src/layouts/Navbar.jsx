import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const navVariants = {
  hidden: { opacity: 0, y: -20, x: '-50%' },
  visible: {
    opacity: 1,
    y: 0,
    x: '-50%',
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Navbar({ setIsModalOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.div 
      className={`navbar-vetra ${scrolled ? 'scrolled' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="nav-logo-left">
        <Shield className="logo-icon-v" size={24} />
        <span className="logo-text-v">TalentSync</span>
      </div>

      <nav className="nav-links-center">
        {links.map((link) => (
          <a key={link.name} href={link.href} className="nav-link-v">
            {link.name}
          </a>
        ))}
      </nav>
    </motion.div>
  );
}

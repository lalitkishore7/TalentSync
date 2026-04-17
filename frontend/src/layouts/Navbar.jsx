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
  const links = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="navbar-vetra">
      <motion.div className="nav-logo-left" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="logo-icon-wrap">
          <Shield className="logo-icon-v" size={24} />
        </div>
        <span className="logo-text-v">TalentSync</span>
      </motion.div>

      <motion.nav className="nav-links-center" variants={navVariants} initial="hidden" animate="visible">
        {links.map((link) => (
          <a key={link.name} href={link.href} className="nav-link-v">
            {link.name}
          </a>
        ))}
      </motion.nav>
    </div>
  );
}

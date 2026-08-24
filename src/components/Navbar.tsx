import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Globe } from 'lucide-react';
import type { Language } from '../types';
import { t } from '../i18n/translations';
import './Navbar.css';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ language, onLanguageChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: language === 'en' ? 'Home' : 'હોમ' },
    { to: '/patient', label: t('patientMode', language) },
    { to: '/asha', label: t('ashaMode', language) },
    { to: '/facilities', label: t('healthcareSupport', language) },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="navbar-logo">
            <Heart size={20} />
          </div>
          <span className="navbar-name">{t('appName', language)}</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="lang-toggle"
            onClick={() => onLanguageChange(language === 'en' ? 'gu' : 'en')}
            title={t('selectLanguage', language)}
          >
            <Globe size={16} />
            <span>{language === 'en' ? 'ગુ' : 'EN'}</span>
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

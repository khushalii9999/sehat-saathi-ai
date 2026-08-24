import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Activity, Shield, MapPin, ChevronRight, Stethoscope, Phone } from 'lucide-react';
import type { Language } from '../types';
import { t } from '../i18n/translations';
import Disclaimer from '../components/Disclaimer';
import './Home.css';

interface HomeProps {
  language: Language;
}

const Home: React.FC<HomeProps> = ({ language }) => {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge">
            <Activity size={14} />
            <span>{t('aiPreliminaryNote', language)}</span>
          </div>
          <h1 className="hero-title">{t('appName', language)}</h1>
          <p className="hero-subtitle">{t('appTagline', language)}</p>

          <div className="hero-cards">
            <Link to="/patient" className="mode-card mode-card--patient">
              <div className="mode-card-icon">
                <Heart size={28} />
              </div>
              <div className="mode-card-body">
                <h2 className="mode-card-title">
                  {t('patientMode', language)}
                </h2>
                <p className="mode-card-desc">
                  {language === 'en'
                    ? 'Check symptoms, get preliminary guidance, understand when to see a doctor.'
                    : 'લક્ષણો તપાસો, પ્રારંભિક માર્ગદર્શન મેળવો, ડૉક્ટર ક્યારે મળવું તે જાણો.'}
                </p>
              </div>
              <ChevronRight size={20} className="mode-card-arrow" />
            </Link>

            <Link to="/asha" className="mode-card mode-card--asha">
              <div className="mode-card-icon">
                <Users size={28} />
              </div>
              <div className="mode-card-body">
                <h2 className="mode-card-title">
                  {t('ashaMode', language)}
                </h2>
                <p className="mode-card-desc">
                  {language === 'en'
                    ? 'Register patients, perform AI-assisted triage, manage your community cases.'
                    : 'દર્દીઓ નોંધો, AI-સહાયિત ટ્રાયેજ કરો, સમુદાય કેસ સંચાલિત કરો.'}
                </p>
              </div>
              <ChevronRight size={20} className="mode-card-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">
            {language === 'en' ? 'How SehatSaathi Helps' : 'સેહત સાથી કેવી મદદ કરે છે'}
          </h2>
          <div className="features-grid">
            {[
              {
                icon: <Stethoscope size={22} />,
                title: language === 'en' ? 'Symptom Triage' : 'લક્ષણ ટ્રાયેજ',
                desc: language === 'en'
                  ? 'Describe symptoms in Gujarati or English and get preliminary risk guidance.'
                  : 'ગુજરાતી અથવા અંગ્રેજીમાં લક્ષણો જણાવો અને પ્રારંભિક જોખમ માર્ગદર્શન મેળવો.',
              },
              {
                icon: <Shield size={22} />,
                title: language === 'en' ? 'Safe & Responsible' : 'સલામત અને જવાબદાર',
                desc: language === 'en'
                  ? 'Never a diagnosis — always guides you toward appropriate professional care.'
                  : 'ક્યારેય નિદાન નહીં — હંમેશા યોગ્ય વ્યાવસાયિક સંભાળ તરફ માર્ગદર્શન.',
              },
              {
                icon: <MapPin size={22} />,
                title: language === 'en' ? 'Local Facilities' : 'સ્થાનિક સુવિધાઓ',
                desc: language === 'en'
                  ? 'Find nearby PHCs, CHCs, hospitals, and ASHA workers in your area.'
                  : 'નજીકના PHC, CHC, હોસ્પિટલ અને ASHA કર્મી શોધો.',
              },
              {
                icon: <Users size={22} />,
                title: language === 'en' ? 'ASHA Support' : 'ASHA સહાય',
                desc: language === 'en'
                  ? 'Dedicated tools for health workers to manage and escalate community cases.'
                  : 'સ્વાસ્થ્ય કર્મીઓ માટે સમુદાય કેસ સંચાલન અને ઉન્નતિ ટૂલ.',
              },
              {
                icon: <Phone size={22} />,
                title: language === 'en' ? 'Voice Input' : 'અવાજ ઇનપુટ',
                desc: language === 'en'
                  ? 'Speak your symptoms — ideal for users with limited literacy or typing ability.'
                  : 'તમારા લક્ષણો બોલો — ઓછી સાક્ષરતા ધરાવતા ઉપયોગકર્તાઓ માટે આદર્શ.',
              },
              {
                icon: <Activity size={22} />,
                title: language === 'en' ? 'Bilingual' : 'દ્વિભાષી',
                desc: language === 'en'
                  ? 'Full support for both Gujarati and English languages throughout the app.'
                  : 'સમગ્ર એપ્લિકેશનમાં ગુજરાતી અને અંગ્રેજી ભાષા માટે સંપૂર્ণ સહાય.',
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="home-disclaimer">
        <div className="container">
          <Disclaimer language={language} />
        </div>
      </section>

      {/* Emergency */}
      <section className="emergency-bar">
        <div className="container emergency-inner">
          <Phone size={18} />
          <span>
            {language === 'en'
              ? 'Medical Emergency? Call 108 — Free Ambulance Service'
              : 'તબીબી કટોકટી? 108 પર ફોન કરો — મફત એમ્બ્યુલન્સ સેવા'}
          </span>
          <a href="tel:108" className="emergency-call-btn">
            {language === 'en' ? 'Call 108' : '108 ડાયલ'}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

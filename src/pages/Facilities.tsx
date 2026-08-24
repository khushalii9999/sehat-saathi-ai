import React, { useState } from 'react';
import { MapPin, Phone, Clock, ChevronDown, ChevronUp, Building2, Hospital, User, Stethoscope } from 'lucide-react';
import type { Language, HealthFacility } from '../types';
import { t } from '../i18n/translations';
import { mockFacilities } from '../data/mockData';
import './Facilities.css';

interface FacilitiesProps {
  language: Language;
}

const facilityTypeLabels: Record<HealthFacility['type'], { en: string; gu: string; icon: React.ReactNode; color: string }> = {
  phc: { en: 'Primary Health Centre', gu: 'પ્રાથમિક આરોગ્ય કેન્દ્ર', icon: <Stethoscope size={18} />, color: '#2563eb' },
  chc: { en: 'Community Health Centre', gu: 'સામુદાયિક આરોગ્ય કેન્દ્ર', icon: <Building2 size={18} />, color: '#7c3aed' },
  hospital: { en: 'District Hospital', gu: 'જિલ્લા હોસ્પિટલ', icon: <Hospital size={18} />, color: '#dc2626' },
  asha: { en: 'ASHA Worker', gu: 'આશા કર્મી', icon: <User size={18} />, color: '#059669' },
};

const filterTypes = [
  { value: 'all', en: 'All', gu: 'બધા' },
  { value: 'phc', en: 'PHC', gu: 'PHC' },
  { value: 'chc', en: 'CHC', gu: 'CHC' },
  { value: 'hospital', en: 'Hospital', gu: 'હોસ્પિટલ' },
  { value: 'asha', en: 'ASHA', gu: 'ASHA' },
];

const Facilities: React.FC<FacilitiesProps> = ({ language }) => {
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? mockFacilities
    : mockFacilities.filter(f => f.type === filter);

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <div className="facilities-page">
      <div className="container">
        <div className="facilities-header">
          <div className="facilities-header-icon"><MapPin size={22} /></div>
          <div>
            <h1 className="facilities-title">{t('nearbyFacilities', language)}</h1>
            <p className="facilities-subtitle">
              {language === 'en'
                ? 'Healthcare facilities in and around your area — Sabarkantha, Gujarat'
                : 'સબરકાંઠા, ગુજરાત — તમારા વિસ્તારમાં અને આસપાસ આરોગ્ય સુવિધાઓ'}
            </p>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="emergency-banner">
          <Phone size={18} />
          <div>
            <span className="emergency-banner-main">
              {language === 'en' ? 'Medical Emergency: Call 108' : 'તબીબી કટોકટી: 108 ડાયલ'}
            </span>
            <span className="emergency-banner-sub">
              {language === 'en' ? 'Free ambulance service — available 24×7' : 'મફત એમ્બ્યુલન્સ સેવા — 24×7 ઉપલબ્ધ'}
            </span>
          </div>
          <a href="tel:108" className="emergency-call-link">
            {language === 'en' ? 'Call 108' : '108 ​ફોન'}
          </a>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          {filterTypes.map(ft => (
            <button
              key={ft.value}
              className={`filter-btn ${filter === ft.value ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(ft.value)}
            >
              {language === 'gu' ? ft.gu : ft.en}
            </button>
          ))}
        </div>

        {/* Facilities list */}
        <div className="facilities-list">
          {filtered.map(facility => {
            const typeInfo = facilityTypeLabels[facility.type];
            const isExpanded = expanded === facility.id;
            return (
              <div key={facility.id} className={`facility-card ${isExpanded ? 'facility-card--expanded' : ''}`}>
                <div className="facility-card-main" onClick={() => toggleExpand(facility.id)}>
                  <div
                    className="facility-type-icon"
                    style={{ background: typeInfo.color + '18', color: typeInfo.color }}
                  >
                    {typeInfo.icon}
                  </div>
                  <div className="facility-info">
                    <div className="facility-name">{facility.name}</div>
                    <div className="facility-type-label" style={{ color: typeInfo.color }}>
                      {language === 'gu' ? typeInfo.gu : typeInfo.en}
                    </div>
                    <div className="facility-meta-row">
                      <span className="facility-meta-item">
                        <MapPin size={13} />
                        {facility.distance}
                      </span>
                      <span className="facility-meta-item">
                        <Clock size={13} />
                        {facility.timings}
                      </span>
                    </div>
                  </div>
                  <button className="expand-btn" aria-label="Expand">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="facility-details fade-in">
                    <div className="facility-detail-row">
                      <MapPin size={15} className="facility-detail-icon" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="facility-detail-row">
                      <Phone size={15} className="facility-detail-icon" />
                      <a href={`tel:${facility.phone}`} className="facility-phone">{facility.phone}</a>
                    </div>
                    <div className="facility-detail-row">
                      <Clock size={15} className="facility-detail-icon" />
                      <span>{facility.timings}</span>
                    </div>
                    <div className="facility-services">
                      <p className="facility-services-label">
                        {language === 'en' ? 'Services' : 'સેવાઓ'}:
                      </p>
                      <div className="facility-services-tags">
                        {facility.services.map((s, i) => (
                          <span key={i} className="service-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="facility-actions">
                      <a href={`tel:${facility.phone}`} className="btn-call">
                        <Phone size={15} />
                        {t('callNow', language)}
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-directions"
                      >
                        <MapPin size={15} />
                        {t('getDirections', language)}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Health worker support note */}
        <div className="health-support-note">
          <User size={16} />
          <p>
            {language === 'en'
              ? 'For ASHA worker contact in your village, speak to the local PHC or ask at your village panchayat.'
              : 'તમારા ગામના ASHA કર્મી સંપર્ક માટે, સ્થાનિક PHC અથવા ગ્રામ પંચાયત પર પૂછો.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Facilities;

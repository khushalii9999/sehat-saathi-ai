import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Language } from '../types';
import { t } from '../i18n/translations';
import './Disclaimer.css';

interface DisclaimerProps {
  language: Language;
  compact?: boolean;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ language, compact = false }) => {
  return (
    <div className={`disclaimer ${compact ? 'disclaimer--compact' : ''}`}>
      <AlertTriangle size={compact ? 16 : 18} className="disclaimer-icon" />
      <div>
        {!compact && (
          <p className="disclaimer-title">{t('disclaimer', language)}</p>
        )}
        <p className="disclaimer-text">{t('disclaimerText', language)}</p>
      </div>
    </div>
  );
};

export default Disclaimer;

import React from 'react';
import {
  AlertTriangle, AlertCircle, CheckCircle,
  Phone, User, MapPin, Calendar, Thermometer, Clock, Save
} from 'lucide-react';
import type { Language, AssessmentForm, AssessmentTriageResult } from '../types';
import { durationLabels } from '../utils/triage';
import UrgencyBadge from './UrgencyBadge';
import Disclaimer from './Disclaimer';
import './TriageResultScreen.css';

interface Props {
  language: Language;
  form: AssessmentForm;
  result: AssessmentTriageResult;
  caseId: string;
  onSave: () => void;
  onNewCase: () => void;
}

const TriageResultScreen: React.FC<Props> = ({
  language, form, result, caseId, onSave, onNewCase,
}) => {
  const l = (en: string, gu: string) => language === 'gu' ? gu : en;

  const urgencyIcon = {
    low: <CheckCircle size={24} />,
    moderate: <AlertCircle size={24} />,
    urgent: <AlertTriangle size={24} />,
  }[result.urgency];

  const isUrgent = result.urgency === 'urgent';

  return (
    <div className="trs-wrap fade-in">
      {/* ── Urgency Banner ─────────────────────────────────────────── */}
      <div className={`trs-banner trs-banner--${result.urgency}`}>
        <div className="trs-banner-icon">{urgencyIcon}</div>
        <div className="trs-banner-body">
          <div className="trs-banner-label">
            {l('Preliminary Triage Result', 'પ્રારંભિક ટ્રાયેજ પરિણામ')}
          </div>
          <UrgencyBadge level={result.urgency} large />
          {isUrgent && (
            <p className="trs-urgent-call">
              {l('Urgent medical evaluation is recommended.', 'ત્વરિત તબીબી મૂલ્યાંકન ભલામણ છે.')}
            </p>
          )}
        </div>
        {isUrgent && (
          <a href="tel:108" className="trs-call-108">
            <Phone size={16} />
            {l('Call 108', '108 ​ફોન')}
          </a>
        )}
      </div>

      {/* ── Patient summary ────────────────────────────────────────── */}
      <div className="trs-card">
        <div className="trs-card-header">
          <User size={15} />
          {l('Patient Summary', 'દર્દી સારાંશ')}
          <span className="trs-case-id">{caseId}</span>
        </div>
        <div className="trs-patient-grid">
          <div className="trs-detail">
            <span className="trs-detail-label">{l('Name', 'નામ')}</span>
            <span className="trs-detail-value">{form.patientName}</span>
          </div>
          <div className="trs-detail">
            <span className="trs-detail-label">{l('Age / Gender', 'ઉ. / લિ.')}</span>
            <span className="trs-detail-value">
              {form.age || '—'} · {l(
                form.gender === 'male' ? 'Male' : form.gender === 'female' ? 'Female' : 'Other',
                form.gender === 'male' ? 'પુ.' : form.gender === 'female' ? 'સ્ત્રી' : 'અ.'
              )}
            </span>
          </div>
          <div className="trs-detail">
            <span className="trs-detail-label"><MapPin size={12} /> {l('Village', 'ગામ')}</span>
            <span className="trs-detail-value">{form.village}</span>
          </div>
          {form.patientId && (
            <div className="trs-detail">
              <span className="trs-detail-label">{l('Patient ID', 'ID')}</span>
              <span className="trs-detail-value">{form.patientId}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Symptoms recorded ─────────────────────────────────────── */}
      <div className="trs-card">
        <div className="trs-card-header">
          <AlertCircle size={15} />
          {l('Symptoms Recorded', 'નોંધાયેલ લક્ષણો')}
        </div>
        <div className="trs-symptom-grid">
          <div className="trs-detail trs-detail--full">
            <span className="trs-detail-label">{l('Main Symptoms', 'મુખ્ય લક્ષણો')}</span>
            <span className="trs-detail-value">{form.mainSymptoms}</span>
          </div>
          <div className="trs-detail">
            <span className="trs-detail-label"><Clock size={12} /> {l('Duration', 'સમય')}</span>
            <span className="trs-detail-value">
              {durationLabels[form.duration] ?? form.duration}
            </span>
          </div>
          {form.temperature && (
            <div className="trs-detail">
              <span className="trs-detail-label"><Thermometer size={12} /> {l('Temperature', 'તાપ.')}</span>
              <span className="trs-detail-value">{form.temperature}</span>
            </div>
          )}
          {form.otherSymptoms && (
            <div className="trs-detail trs-detail--full">
              <span className="trs-detail-label">{l('Other Symptoms', 'અ. લક્ષ.')}</span>
              <span className="trs-detail-value">{form.otherSymptoms}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Red flags ─────────────────────────────────────────────── */}
      {result.redFlagsDetected.length > 0 && (
        <div className="trs-card trs-card--redflag">
          <div className="trs-card-header trs-card-header--red">
            <AlertTriangle size={15} />
            {l('Warning Signs Detected', 'ચેતવણી ચિહ્ન મળ્યા')}
          </div>
          <ul className="trs-redflag-list">
            {result.redFlagsDetected.map((flag, i) => (
              <li key={i} className="trs-redflag-item">
                <AlertTriangle size={14} className="trs-redflag-icon" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── AI Summary ────────────────────────────────────────────── */}
      <div className={`trs-card trs-card--summary trs-card--summary-${result.urgency}`}>
        <p className="trs-summary-label">
          {l('Risk Guidance Summary', 'જોખમ માર્ગદર્શન સારાંશ')}
        </p>
        <p className="trs-summary-text">{result.summary}</p>
      </div>

      {/* ── Escalation reason ─────────────────────────────────────── */}
      <div className="trs-card">
        <div className="trs-card-header">
          <AlertTriangle size={15} />
          {l('Why Escalation is Recommended', 'ઉન્નતિ કેમ ભલામણ')}
        </div>
        <p className="trs-body-text">{result.escalationReason}</p>
      </div>

      {/* ── Recommended next step ─────────────────────────────────── */}
      <div className={`trs-card trs-card--nextstep trs-card--nextstep-${result.urgency}`}>
        <div className="trs-card-header">
          <CheckCircle size={15} />
          {l('Recommended Next Step', 'ભલામણ કરેલ આગળ પગલું')}
        </div>
        <p className="trs-body-text trs-body-text--bold">{result.recommendedNextStep}</p>
      </div>

      {/* ── Follow-up ─────────────────────────────────────────────── */}
      <div className="trs-card">
        <div className="trs-card-header">
          <Calendar size={15} />
          {l('Follow-up Recommendation', 'અનુવર્તન ભલામણ')}
        </div>
        <p className="trs-body-text">{result.followUpRecommendation}</p>
      </div>

      {form.notes && (
        <div className="trs-card">
          <div className="trs-card-header">
            {l('ASHA Notes', 'ASHA નોંધ')}
          </div>
          <p className="trs-body-text">{form.notes}</p>
        </div>
      )}

      {/* ── Disclaimer ────────────────────────────────────────────── */}
      <Disclaimer language={language} />

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className="trs-actions">
        <button type="button" className="trs-btn-secondary" onClick={onNewCase}>
          {l('New Case', 'નવો કેસ')}
        </button>
        <button type="button" className="trs-btn-save" onClick={onSave}>
          <Save size={16} />
          {l('Save Case', 'કેસ સ સ્ટોર')}
        </button>
      </div>
    </div>
  );
};

export default TriageResultScreen;

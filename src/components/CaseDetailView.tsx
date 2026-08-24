import React from 'react';
import {
  AlertTriangle, AlertCircle, CheckCircle, User,
  MapPin, Calendar, Clock, Thermometer, ChevronLeft, Tag
} from 'lucide-react';
import type { Language, PatientCase } from '../types';
import { durationLabels } from '../utils/triage';
import UrgencyBadge from './UrgencyBadge';
import Disclaimer from './Disclaimer';
import './CaseDetailView.css';

interface Props {
  language: Language;
  patientCase: PatientCase;
  onBack: () => void;
}

const CaseDetailView: React.FC<Props> = ({ language, patientCase: c, onBack }) => {
  const l = (en: string, gu: string) => language === 'gu' ? gu : en;

  const tr = c.triageResult;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(language === 'gu' ? 'gu-IN' : 'en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="cdv-wrap fade-in">
      <button className="cdv-back" onClick={onBack}>
        <ChevronLeft size={16} />
        {l('Back to list', 'સૂચિ પર પાછળ')}
      </button>

      {/* Header */}
      <div className={`cdv-banner cdv-banner--${c.urgency}`}>
        <div className="cdv-banner-icon">
          {c.urgency === 'low'      && <CheckCircle  size={22} />}
          {c.urgency === 'moderate' && <AlertCircle  size={22} />}
          {c.urgency === 'urgent'   && <AlertTriangle size={22} />}
        </div>
        <div>
          <p className="cdv-banner-label">{l('Case Assessment', 'કેસ મૂલ્યાંકન')}</p>
          <UrgencyBadge level={c.urgency} large />
          {c.isDemo && (
            <span className="cdv-demo-tag">
              <Tag size={11} /> {l('Demo Data', 'ડેમો ડેટા')}
            </span>
          )}
        </div>
        <span className="cdv-case-id">{c.id}</span>
      </div>

      {/* Patient info */}
      <div className="cdv-card">
        <div className="cdv-card-title">
          <User size={14} /> {l('Patient Information', 'દર્દી માહિતી')}
        </div>
        <div className="cdv-grid">
          <div className="cdv-field">
            <span className="cdv-label">{l('Name', 'નામ')}</span>
            <span className="cdv-value">{c.patientName}</span>
          </div>
          <div className="cdv-field">
            <span className="cdv-label">{l('Age', 'ઉ.')}</span>
            <span className="cdv-value">{c.age || '—'}</span>
          </div>
          <div className="cdv-field">
            <span className="cdv-label">{l('Gender', 'લિ.')}</span>
            <span className="cdv-value" style={{ textTransform: 'capitalize' }}>{c.gender}</span>
          </div>
          <div className="cdv-field">
            <span className="cdv-label">
              <MapPin size={11} /> {l('Village', 'ગામ')}
            </span>
            <span className="cdv-value">{c.village}</span>
          </div>
          {c.patientId && (
            <div className="cdv-field">
              <span className="cdv-label">{l('Patient ID', 'ID')}</span>
              <span className="cdv-value">{c.patientId}</span>
            </div>
          )}
          <div className="cdv-field">
            <span className="cdv-label">
              <Calendar size={11} /> {l('Assessed', 'મૂ. તા.')}
            </span>
            <span className="cdv-value">{formatDate(c.assessedAt)}</span>
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="cdv-card">
        <div className="cdv-card-title">
          <AlertCircle size={14} /> {l('Symptoms Recorded', 'નોંધ. લક્ષણો')}
        </div>
        <div className="cdv-grid">
          <div className="cdv-field cdv-field--full">
            <span className="cdv-label">{l('Main Symptoms', 'મુ. લક્ષ.')}</span>
            <span className="cdv-value">{c.mainSymptoms || c.symptoms}</span>
          </div>
          {c.duration && (
            <div className="cdv-field">
              <span className="cdv-label"><Clock size={11} /> {l('Duration', 'સ.')}</span>
              <span className="cdv-value">{durationLabels[c.duration] ?? c.duration}</span>
            </div>
          )}
          {c.temperature && (
            <div className="cdv-field">
              <span className="cdv-label"><Thermometer size={11} /> {l('Temp.', 'તા.')}</span>
              <span className="cdv-value">{c.temperature}</span>
            </div>
          )}
          {c.otherSymptoms && (
            <div className="cdv-field cdv-field--full">
              <span className="cdv-label">{l('Other Symptoms', 'અ. લ.')}</span>
              <span className="cdv-value">{c.otherSymptoms}</span>
            </div>
          )}
        </div>

        {/* Red flags */}
        {(c.difficultyBreathing || c.severChestPain || c.lossOfConsciousness || c.severebleeding) && (
          <div className="cdv-redflags">
            <div className="cdv-redflag-title">
              <AlertTriangle size={13} /> {l('Warning Signs', 'ચ. ચ.')}
            </div>
            <div className="cdv-redflag-chips">
              {c.difficultyBreathing && <span className="cdv-redflag-chip">{l('Difficulty breathing', 'શ્વાસ ત.')}</span>}
              {c.severChestPain      && <span className="cdv-redflag-chip">{l('Severe chest pain', 'છ. દ.')}</span>}
              {c.lossOfConsciousness && <span className="cdv-redflag-chip">{l('Loss of consciousness', 'ભ. ગ.')}</span>}
              {c.severebleeding      && <span className="cdv-redflag-chip">{l('Severe bleeding', 'ર. સ.')}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Triage result detail (if available) */}
      {tr && (
        <>
          {tr.redFlagsDetected.length > 0 && (
            <div className="cdv-card cdv-card--red">
              <div className="cdv-card-title cdv-card-title--red">
                <AlertTriangle size={14} /> {l('Warning Signs Detected by Triage', 'ટ્રાયેજ દ્વારા ચ. ચ.')}
              </div>
              <ul className="cdv-rf-list">
                {tr.redFlagsDetected.map((f, i) => (
                  <li key={i} className="cdv-rf-item"><AlertTriangle size={13} /> {f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`cdv-card cdv-summary--${c.urgency}`}>
            <div className="cdv-card-title">{l('Risk Guidance Summary', 'જ. સ.')}</div>
            <p className="cdv-body">{tr.summary}</p>
          </div>

          <div className="cdv-card">
            <div className="cdv-card-title">
              <AlertTriangle size={14} /> {l('Why Escalation Recommended', 'ઉ. ક.')}</div>
            <p className="cdv-body">{tr.escalationReason}</p>
          </div>

          <div className={`cdv-card cdv-nextstep--${c.urgency}`}>
            <div className="cdv-card-title"><CheckCircle size={14} /> {l('Recommended Next Step', 'ભ. આ. પ.')}</div>
            <p className="cdv-body cdv-body--bold">{tr.recommendedNextStep}</p>
          </div>

          <div className="cdv-card">
            <div className="cdv-card-title"><Calendar size={14} /> {l('Follow-up', 'અ.')}</div>
            <p className="cdv-body">{tr.followUpRecommendation}</p>
          </div>
        </>
      )}

      {/* Legacy fields fallback */}
      {!tr && (
        <>
          {c.escalationReason && (
            <div className="cdv-card">
              <div className="cdv-card-title">{l('Escalation Reason', 'ઉ. ક.')}</div>
              <p className="cdv-body">{c.escalationReason}</p>
            </div>
          )}
          {c.followUp && (
            <div className="cdv-card">
              <div className="cdv-card-title">{l('Follow-up', 'અ.')}</div>
              <p className="cdv-body">{c.followUp}</p>
            </div>
          )}
        </>
      )}

      {c.notes && (
        <div className="cdv-card">
          <div className="cdv-card-title">{l('ASHA Notes', 'ASHA ન.')}</div>
          <p className="cdv-body">{c.notes}</p>
        </div>
      )}

      <Disclaimer language={language} compact />
    </div>
  );
};

export default CaseDetailView;

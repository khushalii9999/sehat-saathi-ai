import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, MicOff, Send, RefreshCw, CheckCircle,
  AlertCircle, AlertTriangle, ChevronRight, Heart,
  Phone, MapPin, User, Clock,
} from 'lucide-react';
import type { Language, TriageResult, PatientInfo } from '../types';
import { t } from '../i18n/translations';
import { performTriage, followUpQuestions, hasEmergencyKeywords } from '../utils/triage';
import UrgencyBadge from '../components/UrgencyBadge';
import Disclaimer from '../components/Disclaimer';
import './PatientMode.css';

interface PatientModeProps {
  language: Language;
}

type Step = 'input' | 'patientinfo' | 'followup' | 'loading' | 'result';

const EMPTY_INFO: PatientInfo = {
  age: '',
  gender: '',
  symptomDuration: '',
  existingConditions: '',
  currentMedications: '',
};

const PatientMode: React.FC<PatientModeProps> = ({ language }) => {
  const [step, setStep]               = useState<Step>('input');
  const [symptoms, setSymptoms]       = useState('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(EMPTY_INFO);
  const [currentQ, setCurrentQ]       = useState(0);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [result, setResult]           = useState<TriageResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Derived: no state needed — recomputed on every render
  const showEmergency = symptoms.length > 4 && hasEmergencyKeywords(symptoms);

  // ── Voice input ────────────────────────────────────────────────────────────
  const startVoice = () => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(
        language === 'en'
          ? 'Voice input is not supported in this browser. Please type your symptoms.'
          : 'આ બ્રાઉઝરમાં અવાજ ઇનપુટ સમર્થિત નથી. કૃપા કરીને ટાઈપ કરો.',
      );
      return;
    }
    const rec = new SpeechRec();
    rec.lang = language === 'gu' ? 'gu-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setSymptoms(prev => (prev ? prev + ' ' + transcript : transcript));
    };
    rec.onend = () => setIsRecording(false);
    rec.onerror = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // ── Flow handlers ──────────────────────────────────────────────────────────
  const handleStartAssessment = () => {
    if (!symptoms.trim()) return;
    setStep('patientinfo');
  };

  const handlePatientInfoContinue = () => {
    setStep('followup');
    setCurrentQ(0);
  };

  const handleAnswer = (value: string) => {
    const q = followUpQuestions[currentQ];
    const updated = { ...answers, [q.id]: value };
    setAnswers(updated);
    if (currentQ + 1 < followUpQuestions.length) {
      setCurrentQ(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => {
        setResult(performTriage(symptoms, updated, patientInfo));
        setStep('result');
      }, 1800);
    }
  };

  const handleReset = () => {
    setStep('input');
    setSymptoms('');
    setPatientInfo(EMPTY_INFO);
    setAnswers({});
    setResult(null);
    setCurrentQ(0);
  };

  // ── Step labels for progress indicator ────────────────────────────────────
  const stepIndex: Record<Step, number> = {
    input: 0, patientinfo: 1, followup: 2, loading: 3, result: 3,
  };
  const totalSteps = 3;
  const progressPct = (stepIndex[step] / totalSteps) * 100;

  const q = followUpQuestions[currentQ];

  const urgencyIcon = result ? {
    low: <CheckCircle size={24} />,
    moderate: <AlertCircle size={24} />,
    urgent: <AlertTriangle size={24} />,
  }[result.urgency] : null;

  // ── Duration options (derived from translations) ───────────────────────────
  const durationOptions = [
    { value: 'less_1d', label: t('durationLess1d', language) },
    { value: '1_3d',    label: t('duration1to3d', language) },
    { value: '3_7d',    label: t('duration3to7d', language) },
    { value: 'over_week', label: t('durationOverWeek', language) },
  ];

  return (
    <div className="patient-page">
      <div className="container">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="patient-header">
          <div className="patient-header-icon">
            <Heart size={22} />
          </div>
          <div className="patient-header-text">
            <h1 className="patient-header-title">
              {t('howAreYouFeeling', language)}
            </h1>
            <p className="patient-header-sub">
              {t('patientModeIntro', language)}
            </p>
          </div>
        </div>

        {/* ── Progress bar (steps 1–3) ──────────────────────────────────── */}
        {step !== 'result' && (
          <div className="flow-progress" aria-label="Assessment progress">
            <div className="flow-progress-track">
              <div
                className="flow-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flow-progress-steps">
              {['Symptoms', 'About You', 'Questions'].map((label, i) => (
                <span
                  key={i}
                  className={`flow-step-label ${stepIndex[step] > i ? 'done' : stepIndex[step] === i ? 'active' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="patient-content">

          {/* ════════════════════════════════════════════════════════════
              STEP 1 — Symptom input
          ═════════════════════════════════════════════════════════════ */}
          {step === 'input' && (
            <div className="card fade-in">

              {/* Emergency banner */}
              {showEmergency && (
                <div className="emergency-banner">
                  <div className="emergency-banner-header">
                    <AlertTriangle size={20} />
                    <strong>{t('emergencyWarningTitle', language)}</strong>
                  </div>
                  <p>{t('emergencyWarningBody', language)}</p>
                  <a href="tel:108" className="emergency-call-link">
                    <Phone size={16} />
                    {t('callEmergency', language)}
                  </a>
                </div>
              )}

              <h2 className="card-title">{t('enterSymptoms', language)}</h2>
              <p className="card-subtitle">
                {language === 'en'
                  ? 'You can type or speak your symptoms. Be as specific as possible.'
                  : 'તમે ટાઈપ અથવા બોલીને લક્ષણો જણાવી શકો છો. શક્ય તેટલું વિગતવાર.'}
              </p>

              <textarea
                className="symptoms-textarea"
                placeholder={t('symptomsPlaceholder', language)}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                rows={5}
                aria-label={t('enterSymptoms', language)}
              />

              <div className="input-actions">
                <button
                  className={`btn-voice ${isRecording ? 'btn-voice--active' : ''}`}
                  onClick={isRecording ? stopVoice : startVoice}
                  aria-pressed={isRecording}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording ? t('stopRecording', language) : t('voiceInput', language)}
                  {isRecording && <span className="recording-pulse" />}
                </button>

                <button
                  className="btn-primary"
                  onClick={handleStartAssessment}
                  disabled={!symptoms.trim()}
                >
                  <Send size={16} />
                  {t('startAssessment', language)}
                </button>
              </div>

              {isRecording && (
                <p className="recording-hint">
                  🎙 {t('listening', language)}
                </p>
              )}

              <div style={{ marginTop: '20px' }}>
                <Disclaimer language={language} compact />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              STEP 2 — Optional patient info
          ═════════════════════════════════════════════════════════════ */}
          {step === 'patientinfo' && (
            <div className="card fade-in">
              <h2 className="card-title">{t('patientInfoTitle', language)}</h2>
              <p className="card-subtitle">{t('patientInfoSubtitle', language)}</p>

              <div className="info-grid">
                {/* Age */}
                <div className="info-field">
                  <label className="field-label">
                    <User size={14} />
                    {t('ageOptional', language)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className="field-input"
                    placeholder={language === 'en' ? 'e.g. 35' : 'ઉ. 35'}
                    value={patientInfo.age}
                    onChange={e => setPatientInfo(p => ({ ...p, age: e.target.value }))}
                  />
                </div>

                {/* Gender */}
                <div className="info-field">
                  <label className="field-label">
                    <User size={14} />
                    {t('genderOptional', language)}
                  </label>
                  <div className="gender-buttons">
                    {(['male', 'female', 'other'] as const).map(g => (
                      <button
                        key={g}
                        className={`btn-gender ${patientInfo.gender === g ? 'btn-gender--active' : ''}`}
                        onClick={() => setPatientInfo(p => ({ ...p, gender: g }))}
                      >
                        {t(g, language)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="info-field full-width">
                <label className="field-label">
                  <Clock size={14} />
                  {t('symptomDuration', language)}
                </label>
                <div className="duration-grid">
                  {durationOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`btn-duration ${patientInfo.symptomDuration === opt.value ? 'btn-duration--active' : ''}`}
                      onClick={() => setPatientInfo(p => ({ ...p, symptomDuration: opt.value }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing conditions */}
              <div className="info-field full-width">
                <label className="field-label">
                  {t('existingConditions', language)}
                </label>
                <textarea
                  className="field-textarea"
                  rows={2}
                  placeholder={t('conditionsPlaceholder', language)}
                  value={patientInfo.existingConditions}
                  onChange={e => setPatientInfo(p => ({ ...p, existingConditions: e.target.value }))}
                />
              </div>

              {/* Current medications */}
              <div className="info-field full-width">
                <label className="field-label">
                  {t('currentMedications', language)}
                </label>
                <textarea
                  className="field-textarea"
                  rows={2}
                  placeholder={t('medicationsPlaceholder', language)}
                  value={patientInfo.currentMedications}
                  onChange={e => setPatientInfo(p => ({ ...p, currentMedications: e.target.value }))}
                />
              </div>

              <div className="info-actions">
                <button className="btn-secondary" onClick={handlePatientInfoContinue}>
                  {t('skipAndContinue', language)}
                </button>
                <button className="btn-primary" onClick={handlePatientInfoContinue}>
                  <ChevronRight size={16} />
                  {t('continueToAssessment', language)}
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              STEP 3 — Follow-up questions
          ═════════════════════════════════════════════════════════════ */}
          {step === 'followup' && (
            <div className="card fade-in">
              <div className="followup-progress">
                <div className="followup-progress-bar">
                  <div
                    className="followup-progress-fill"
                    style={{ width: `${((currentQ) / followUpQuestions.length) * 100}%` }}
                  />
                </div>
                <span className="followup-progress-label">
                  {language === 'en'
                    ? `Question ${currentQ + 1} of ${followUpQuestions.length}`
                    : `પ્રશ્ન ${currentQ + 1} / ${followUpQuestions.length}`}
                </span>
              </div>

              <h2 className="card-title">{t('followUpQuestions', language)}</h2>
              <p className="followup-question">
                {language === 'gu' ? q.questionGu : q.question}
              </p>

              {q.type === 'yesno' && (
                <div className="answer-buttons">
                  <button className="btn-answer btn-answer--yes" onClick={() => handleAnswer('yes')}>
                    <CheckCircle size={18} /> {t('yes', language)}
                  </button>
                  <button className="btn-answer btn-answer--no" onClick={() => handleAnswer('no')}>
                    {t('no', language)}
                  </button>
                </div>
              )}

              {q.type === 'choice' && (
                <div className="choice-list">
                  {(language === 'gu' ? q.optionsGu ?? q.options : q.options)!.map((opt, i) => (
                    <button
                      key={i}
                      className="btn-choice"
                      onClick={() => handleAnswer(q.options![i])}
                    >
                      <ChevronRight size={16} />
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              LOADING
          ═════════════════════════════════════════════════════════════ */}
          {step === 'loading' && (
            <div className="card fade-in loading-card">
              <div className="loading-spinner" />
              <p className="loading-text">{t('loading', language)}</p>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              STEP 4 — Result
          ═════════════════════════════════════════════════════════════ */}
          {step === 'result' && result && (
            <div className="card fade-in result-card">

              {/* Result header */}
              <div className={`result-header result-header--${result.urgency}`}>
                <div className="result-header-icon">{urgencyIcon}</div>
                <div>
                  <p className="result-label">{t('triageResult', language)}</p>
                  <UrgencyBadge level={result.urgency} large />
                </div>
              </div>

              <p className="result-summary">{result.summary}</p>

              {/* Guidance */}
              <div className="result-section">
                <h3 className="result-section-title">{t('guidance', language)}</h3>
                <ul className="guidance-list">
                  {result.guidance.map((g, i) => (
                    <li key={i} className="guidance-item">
                      <CheckCircle size={16} className="guidance-check" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended next step */}
              {result.followUp && (
                <div className={`result-section next-step-box next-step-box--${result.urgency}`}>
                  <h3 className="result-section-title">{t('recommendedNextStep', language)}</h3>
                  <p className="next-step-text">{result.followUp}</p>
                </div>
              )}

              {/* Escalation reason */}
              {result.escalationReason && (
                <div className="result-section escalation-box">
                  <h3 className="result-section-title">{t('escalationReason', language)}</h3>
                  <p className="escalation-text">{result.escalationReason}</p>
                </div>
              )}

              <Disclaimer language={language} />

              {/* Action buttons */}
              <div className="result-actions">
                <button className="btn-primary btn-reset" onClick={handleReset}>
                  <RefreshCw size={16} />
                  {t('newAssessment', language)}
                </button>
                <Link to="/facilities" className="btn-secondary btn-facilities">
                  <MapPin size={16} />
                  {t('viewHealthcareSupport', language)}
                </Link>
              </div>

              {/* Emergency call bar for urgent results */}
              {result.urgency === 'urgent' && (
                <a href="tel:108" className="result-emergency-bar">
                  <Phone size={18} />
                  <span>
                    {language === 'en'
                      ? 'Medical Emergency? Call 108 — Free Ambulance Service'
                      : 'તબીબી કટોકટી? 108 પર ફોન કરો — મફત એમ્બ્યુલન્સ'}
                  </span>
                  <span className="result-emergency-badge">
                    {language === 'en' ? 'Call 108' : '108 ડાયલ'}
                  </span>
                </a>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PatientMode;

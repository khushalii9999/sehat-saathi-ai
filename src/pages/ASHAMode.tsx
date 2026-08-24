import React, { useState } from 'react';
import {
  Users, ClipboardList, BarChart2, UserPlus,
  AlertTriangle, ChevronRight, Tag, Search
} from 'lucide-react';
import type { Language, AssessmentForm, AssessmentTriageResult, PatientCase } from '../types';
import { t } from '../i18n/translations';
import { performAshaTriageFromForm, generateCaseId } from '../utils/triage';
import { ASHA_WORKER } from '../data/mockData';
import { useCases } from '../hooks/useCases';
import AssessmentFormComponent from '../components/AssessmentFormComponent';
import TriageResultScreen from '../components/TriageResultScreen';
import CaseDetailView from '../components/CaseDetailView';
import UrgencyBadge from '../components/UrgencyBadge';
import './ASHAMode.css';

interface ASHAModeProps {
  language: Language;
}

type Tab = 'dashboard' | 'newCase' | 'cases';
// New-case sub-steps
type NewCaseStep = 'form' | 'result' | 'saved';

const ASHAMode: React.FC<ASHAModeProps> = ({ language }) => {
  const { cases, addCase } = useCases();

  const [tab, setTab] = useState<Tab>('dashboard');
  // New-case state
  const [newCaseStep, setNewCaseStep] = useState<NewCaseStep>('form');
  const [pendingForm, setPendingForm] = useState<AssessmentForm | null>(null);
  const [pendingResult, setPendingResult] = useState<AssessmentTriageResult | null>(null);
  const [pendingCaseId, setPendingCaseId] = useState<string>('');
  // Cases tab state
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [search, setSearch] = useState('');

  const l = (en: string, gu: string) => language === 'gu' ? gu : en;

  // Derived stats — always up to date from live cases
  const stats = {
    total: cases.length,
    low: cases.filter(c => c.urgency === 'low').length,
    moderate: cases.filter(c => c.urgency === 'moderate').length,
    urgent: cases.filter(c => c.urgency === 'urgent').length,
  };

  const urgentCases = cases.filter(c => c.urgency === 'urgent');
  const recentCases = cases.slice(0, 6);

  const filteredCases = search.trim()
    ? cases.filter(c =>
        c.patientName.toLowerCase().includes(search.toLowerCase()) ||
        c.village.toLowerCase().includes(search.toLowerCase()) ||
        c.mainSymptoms?.toLowerCase().includes(search.toLowerCase()) ||
        c.symptoms?.toLowerCase().includes(search.toLowerCase())
      )
    : cases;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(language === 'gu' ? 'gu-IN' : 'en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  // ── New case handlers ──────────────────────────────────────────────────────

  const handleFormSubmit = (form: AssessmentForm) => {
    const result = performAshaTriageFromForm(form);
    const caseId = generateCaseId(cases.filter(c => !c.isDemo).length);
    setPendingForm(form);
    setPendingResult(result);
    setPendingCaseId(caseId);
    setNewCaseStep('result');
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCase = () => {
    if (!pendingForm || !pendingResult) return;
    const newCase: PatientCase = {
      id: pendingCaseId,
      isDemo: false,
      patientName: pendingForm.patientName,
      age: parseInt(pendingForm.age, 10) || 0,
      gender: pendingForm.gender,
      village: pendingForm.village,
      patientId: pendingForm.patientId || undefined,
      mainSymptoms: pendingForm.mainSymptoms,
      duration: pendingForm.duration,
      temperature: pendingForm.temperature || undefined,
      difficultyBreathing: pendingForm.difficultyBreathing,
      severChestPain: pendingForm.severChestPain,
      lossOfConsciousness: pendingForm.lossOfConsciousness,
      severebleeding: pendingForm.severebleeding,
      otherSymptoms: pendingForm.otherSymptoms || undefined,
      notes: pendingForm.notes || undefined,
      symptoms: pendingForm.mainSymptoms,
      urgency: pendingResult.urgency,
      triageResult: pendingResult,
      escalationReason: pendingResult.escalationReason,
      followUp: pendingResult.followUpRecommendation,
      assessedAt: new Date().toISOString(),
      ashaName: ASHA_WORKER.name,
    };
    addCase(newCase);
    setNewCaseStep('saved');
    // Switch to dashboard to show updated stats
    setTab('dashboard');
    resetNewCase();
  };

  const resetNewCase = () => {
    setPendingForm(null);
    setPendingResult(null);
    setPendingCaseId('');
    setNewCaseStep('form');
  };

  const startNewCase = () => {
    resetNewCase();
    setTab('newCase');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="asha-page">
      <div className="container">

        {/* Header */}
        <div className="asha-header">
          <div className="asha-header-icon"><Users size={22} /></div>
          <div>
            <h1 className="asha-header-title">{t('ashaMode', language)}</h1>
            <p className="asha-header-sub">
              {ASHA_WORKER.name} · {ASHA_WORKER.village} · {ASHA_WORKER.id}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="asha-tabs">
          {([
            { id: 'dashboard' as Tab, label: t('dashboard', language),       icon: <BarChart2 size={15} />    },
            { id: 'newCase'   as Tab, label: l('New Case', 'નવો કેસ'),        icon: <UserPlus size={15} />     },
            { id: 'cases'     as Tab, label: t('recentCases', language),      icon: <ClipboardList size={15} /> },
          ]).map(tabItem => (
            <button
              key={tabItem.id}
              className={`asha-tab ${tab === tabItem.id ? 'asha-tab--active' : ''}`}
              onClick={() => {
                setTab(tabItem.id);
                if (tabItem.id !== 'newCase') setSelectedCase(null);
              }}
            >
              {tabItem.icon}
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB: DASHBOARD
        ══════════════════════════════════════════════════════════════ */}
        {tab === 'dashboard' && (
          <div className="fade-in">

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label: t('totalCases', language),            value: stats.total,    color: '#2563eb', bg: '#dbeafe' },
                { label: t('urgencyLow', language),            value: stats.low,      color: '#059669', bg: '#d1fae5' },
                { label: l('Moderate', 'મધ્યમ'),              value: stats.moderate, color: '#d97706', bg: '#fef3c7' },
                { label: t('urgentCases', language),           value: stats.urgent,   color: '#dc2626', bg: '#fee2e2' },
              ].map((stat, i) => (
                <div key={i} className="stat-card" style={{ borderTopColor: stat.color }}>
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Urgent cases section */}
            {urgentCases.length > 0 && (
              <div className="dashboard-section dashboard-section--urgent">
                <h2 className="section-heading section-heading--urgent">
                  <AlertTriangle size={17} />
                  {t('urgentCases', language)} ({urgentCases.length})
                </h2>
                <div className="case-list">
                  {urgentCases.map(c => (
                    <CaseRow
                      key={c.id}
                      c={c}
                      formatDate={formatDate}
                      onClick={() => { setSelectedCase(c); setTab('cases'); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent assessments */}
            <div className="dashboard-section">
              <h2 className="section-heading">
                <ClipboardList size={17} />
                {t('recentCases', language)}
              </h2>
              {recentCases.length === 0 ? (
                <p className="empty-text">
                  {l('No cases yet. Start a new assessment.', 'હજુ કોઈ કેસ નથી. નવું મૂલ્યાંકન શરૂ કરો.')}
                </p>
              ) : (
                <div className="case-list">
                  {recentCases.map(c => (
                    <CaseRow
                      key={c.id}
                      c={c}
                      formatDate={formatDate}
                      onClick={() => { setSelectedCase(c); setTab('cases'); }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button className="btn-new-case-cta" onClick={startNewCase}>
              <UserPlus size={16} />
              {l('Start New Case Assessment', 'નવું કેસ મૂલ્યાંકન શરૂ કરો')}
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: NEW CASE
        ══════════════════════════════════════════════════════════════ */}
        {tab === 'newCase' && (
          <div className="new-case-content fade-in">
            {newCaseStep === 'form' && (
              <div className="asha-card">
                <AssessmentFormComponent
                  language={language}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setTab('dashboard')}
                />
              </div>
            )}

            {newCaseStep === 'result' && pendingForm && pendingResult && (
              <div className="asha-card">
                <TriageResultScreen
                  language={language}
                  form={pendingForm}
                  result={pendingResult}
                  caseId={pendingCaseId}
                  onSave={handleSaveCase}
                  onNewCase={startNewCase}
                />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: CASES
        ══════════════════════════════════════════════════════════════ */}
        {tab === 'cases' && (
          <div className="fade-in">
            {selectedCase ? (
              <CaseDetailView
                language={language}
                patientCase={selectedCase}
                onBack={() => setSelectedCase(null)}
              />
            ) : (
              <>
                <div className="cases-header">
                  <h2 className="section-heading" style={{ margin: 0 }}>
                    <ClipboardList size={17} />
                    {t('recentCases', language)} ({cases.length})
                  </h2>
                  <div className="cases-search-wrap">
                    <Search size={15} className="cases-search-icon" />
                    <input
                      className="cases-search"
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={l('Search name, village, symptoms…', 'નામ, ગામ, લક્ષ. શોધો…')}
                    />
                  </div>
                </div>

                {filteredCases.length === 0 ? (
                  <p className="empty-text" style={{ marginTop: 20 }}>
                    {l('No cases match your search.', 'શોધ સાથે કોઈ કેસ મળ્યો નથી.')}
                  </p>
                ) : (
                  <div className="case-list" style={{ marginTop: 16 }}>
                    {filteredCases.map(c => (
                      <CaseRow
                        key={c.id}
                        c={c}
                        formatDate={formatDate}
                        showCaseId
                        onClick={() => setSelectedCase(c)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// ── Shared case row sub-component ────────────────────────────────────────────

interface CaseRowProps {
  c: PatientCase;
  formatDate: (s: string) => string;
  onClick: () => void;
  showCaseId?: boolean;
}

const CaseRow: React.FC<CaseRowProps> = ({ c, formatDate, onClick, showCaseId }) => (
  <button className={`case-card ${c.urgency === 'urgent' ? 'case-card--urgent' : ''}`} onClick={onClick}>
    <div className="case-card-main">
      <div className="case-card-top">
        <span className="case-patient-name">{c.patientName}</span>
        {c.isDemo && <span className="case-demo-badge"><Tag size={10} /> Demo</span>}
        {showCaseId && <span className="case-id-badge">{c.id}</span>}
      </div>
      <div className="case-meta">
        {c.age}y · {c.gender} · {c.village} · {formatDate(c.assessedAt)}
      </div>
      <div className="case-symptoms">{c.mainSymptoms || c.symptoms}</div>
    </div>
    <div className="case-card-right">
      <UrgencyBadge level={c.urgency} />
      <ChevronRight size={15} className="case-chevron" />
    </div>
  </button>
);

export default ASHAMode;

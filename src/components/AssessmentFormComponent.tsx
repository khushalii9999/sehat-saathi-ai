import React, { useState, useRef } from 'react';
import { Mic, MicOff, ChevronRight, AlertTriangle, Info } from 'lucide-react';
import type { Language, AssessmentForm } from '../types';
import { t } from '../i18n/translations';
import './AssessmentFormComponent.css';

interface Props {
  language: Language;
  onSubmit: (form: AssessmentForm) => void;
  onCancel: () => void;
}

const EMPTY_FORM: AssessmentForm = {
  patientName: '',
  age: '',
  gender: 'female',
  village: '',
  patientId: '',
  mainSymptoms: '',
  duration: '',
  temperature: '',
  difficultyBreathing: false,
  severChestPain: false,
  lossOfConsciousness: false,
  severebleeding: false,
  otherSymptoms: '',
  notes: '',
};

const AssessmentFormComponent: React.FC<Props> = ({ language, onSubmit, onCancel }) => {
  const [form, setForm] = useState<AssessmentForm>({ ...EMPTY_FORM });
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTarget, setVoiceTarget] = useState<'mainSymptoms' | 'otherSymptoms' | null>(null);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AssessmentForm, string>>>({});
  const recognitionRef = useRef<any>(null);

  const set = <K extends keyof AssessmentForm>(key: K, value: AssessmentForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const hasAnyRedFlag =
    form.difficultyBreathing || form.severChestPain ||
    form.lossOfConsciousness || form.severebleeding;

  const startVoice = (target: 'mainSymptoms' | 'otherSymptoms') => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceUnavailable(true);
      return;
    }
    setVoiceUnavailable(false);
    const rec = new SpeechRec();
    rec.lang = language === 'gu' ? 'gu-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      setForm(prev => ({
        ...prev,
        [target]: prev[target] ? prev[target] + ' ' + transcript : transcript,
      }));
    };
    rec.onend = () => { setIsRecording(false); setVoiceTarget(null); };
    rec.onerror = () => { setIsRecording(false); setVoiceTarget(null); };
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    setVoiceTarget(target);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setVoiceTarget(null);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof AssessmentForm, string>> = {};
    if (!form.patientName.trim())   errs.patientName   = language === 'en' ? 'Patient name is required' : 'દર્દીનું નામ જરૂરી છે';
    if (!form.village.trim())       errs.village       = language === 'en' ? 'Village is required' : 'ગામ જરૂરી છે';
    if (!form.mainSymptoms.trim())  errs.mainSymptoms  = language === 'en' ? 'Please describe the main symptoms' : 'મુખ્ય લક્ષણો જણાવો';
    if (!form.duration)             errs.duration      = language === 'en' ? 'Please select symptom duration' : 'સમયગાળો પસંદ કરો';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const l = (en: string, gu: string) => language === 'gu' ? gu : en;

  return (
    <form className="assessment-form" onSubmit={handleSubmit} noValidate>
      <div className="aform-header">
        <h2 className="aform-title">
          {l('New Patient Assessment', 'નવું દર્દી મૂલ્યાંકન')}
        </h2>
        <p className="aform-subtitle">
          {l('Fill in the patient details and symptoms below.', 'નીચે દર્દીની માહિતી અને લક્ષણો ભરો.')}
        </p>
      </div>

      {/* ── Section 1: Patient Info ─────────────────────────────────── */}
      <fieldset className="aform-section">
        <legend className="aform-section-title">
          {l('Patient Information', 'દર્દી માહિતી')}
        </legend>

        <div className="aform-row">
          <label className="aform-label">
            {l('Patient Name', 'દર્દીનું નામ')} <span className="required">*</span>
          </label>
          <input
            className={`aform-input ${errors.patientName ? 'aform-input--error' : ''}`}
            type="text"
            value={form.patientName}
            onChange={e => set('patientName', e.target.value)}
            placeholder={l('Full name', 'પૂરું નામ')}
            autoComplete="off"
          />
          {errors.patientName && <span className="aform-error">{errors.patientName}</span>}
        </div>

        <div className="aform-row-3">
          <div className="aform-row">
            <label className="aform-label">{l('Age', 'ઉંમર')}</label>
            <input
              className="aform-input"
              type="number"
              value={form.age}
              onChange={e => set('age', e.target.value)}
              placeholder="0–120"
              min={0} max={120}
            />
          </div>

          <div className="aform-row">
            <label className="aform-label">{l('Gender', 'લિંગ')}</label>
            <select
              className="aform-input"
              value={form.gender}
              onChange={e => set('gender', e.target.value as AssessmentForm['gender'])}
            >
              <option value="female">{l('Female', 'સ્ત્રી')}</option>
              <option value="male">{l('Male', 'પુરુષ')}</option>
              <option value="other">{l('Other', 'અન્ય')}</option>
            </select>
          </div>

          <div className="aform-row">
            <label className="aform-label">{l('Patient ID', 'દર્દી ID')} <span className="optional">{l('(opt.)', '(વૈ.)')}</span></label>
            <input
              className="aform-input"
              type="text"
              value={form.patientId}
              onChange={e => set('patientId', e.target.value)}
              placeholder={l('e.g. PHC-102', 'ઉ.દ. PHC-102')}
            />
          </div>
        </div>

        <div className="aform-row">
          <label className="aform-label">
            {l('Village / Area', 'ગામ / વિસ્તાર')} <span className="required">*</span>
          </label>
          <input
            className={`aform-input ${errors.village ? 'aform-input--error' : ''}`}
            type="text"
            value={form.village}
            onChange={e => set('village', e.target.value)}
            placeholder={l('Village or area name', 'ગામ અથવા વિસ્તારનું નામ')}
          />
          {errors.village && <span className="aform-error">{errors.village}</span>}
        </div>
      </fieldset>

      {/* ── Section 2: Red Flags ────────────────────────────────────── */}
      <fieldset className="aform-section aform-section--redflags">
        <legend className="aform-section-title aform-section-title--red">
          <AlertTriangle size={15} />
          {l('Warning Signs — Check All That Apply', 'ચેતવણી ચિહ્નો — લાગુ પડે તે બધા ટિક કરો')}
        </legend>
        <p className="aform-redflag-hint">
          {l(
            'Tick YES if the patient has any of these right now. These are serious warning signs.',
            'જો દર્દીને હાલ આ કોઈ લક્ષણ છે, તો ટિક કરો. આ ગંભીર ચેતવણી ચિહ્નો છે.'
          )}
        </p>

        {[
          { key: 'difficultyBreathing' as const, en: 'Difficulty breathing / shortness of breath', gu: 'શ્વાસ લેવામાં તકલીફ / શ્વાસ ટૂંકો' },
          { key: 'severChestPain'      as const, en: 'Severe chest pain',                          gu: 'ગંભીર છાતીનો દુ:ખાવો' },
          { key: 'lossOfConsciousness' as const, en: 'Loss of consciousness / patient unresponsive', gu: 'ભાન ગુમ / દર્દી પ્રતિભાવ ન આપે' },
          { key: 'severebleeding'      as const, en: 'Severe or uncontrolled bleeding',             gu: 'ગંભીર અથવા અનિયંત્રિત રક્તસ્ત્રાવ' },
        ].map(flag => (
          <label key={flag.key} className={`aform-checkbox-row ${form[flag.key] ? 'aform-checkbox-row--checked' : ''}`}>
            <input
              type="checkbox"
              className="aform-checkbox"
              checked={form[flag.key]}
              onChange={e => set(flag.key, e.target.checked)}
            />
            <span className="aform-checkbox-label">{language === 'gu' ? flag.gu : flag.en}</span>
          </label>
        ))}

        {hasAnyRedFlag && (
          <div className="aform-urgent-alert">
            <AlertTriangle size={16} />
            <span>
              {l(
                'Warning signs detected. This case will be marked as Urgent. Refer immediately.',
                'ચેતવણી ચિહ્ન મળ્યા. આ કેસ Urgent ગણાશે. તત્કાળ રેફર કરો.'
              )}
            </span>
          </div>
        )}
      </fieldset>

      {/* ── Section 3: Symptoms ─────────────────────────────────────── */}
      <fieldset className="aform-section">
        <legend className="aform-section-title">
          {l('Symptoms & History', 'લક્ષણો અને ઇતિહાસ')}
        </legend>

        <div className="aform-row">
          <label className="aform-label">
            {l('Main Symptoms', 'મુખ્ય લક્ષણો')} <span className="required">*</span>
          </label>
          <div className="aform-textarea-wrap">
            <textarea
              className={`aform-textarea ${errors.mainSymptoms ? 'aform-input--error' : ''}`}
              rows={3}
              value={form.mainSymptoms}
              onChange={e => set('mainSymptoms', e.target.value)}
              placeholder={l(
                'e.g. Fever since 2 days, headache, vomiting once...',
                'ઉ.દ. 2 દિવસથી તાવ, માથું દુ:ખે, એક વખત ઉલ્ટી...'
              )}
            />
            <button
              type="button"
              className={`aform-voice-btn ${isRecording && voiceTarget === 'mainSymptoms' ? 'aform-voice-btn--active' : ''}`}
              onClick={() =>
                isRecording && voiceTarget === 'mainSymptoms' ? stopVoice() : startVoice('mainSymptoms')
              }
              title={l('Voice input', 'અવાજ ઇનપુટ')}
            >
              {isRecording && voiceTarget === 'mainSymptoms' ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          {isRecording && voiceTarget === 'mainSymptoms' && (
            <span className="aform-listening">{t('listening', language)}</span>
          )}
          {errors.mainSymptoms && <span className="aform-error">{errors.mainSymptoms}</span>}
          {voiceUnavailable && (
            <span className="aform-voice-note">
              <Info size={13} />
              {l('Voice input is not available in this browser. Please type.', 'આ બ્રાઉઝરમાં અવાજ ઇનપુટ ઉપલબ્ધ નથી. ટાઈપ કરો.')}
            </span>
          )}
        </div>

        <div className="aform-row-2">
          <div className="aform-row">
            <label className="aform-label">
              {l('Duration of Symptoms', 'લક્ષણો કેટલા સમયથી')} <span className="required">*</span>
            </label>
            <select
              className={`aform-input ${errors.duration ? 'aform-input--error' : ''}`}
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
            >
              <option value="">{l('Select duration…', 'સમયગાળો પસંદ કરો…')}</option>
              <option value="less_1d">{l('Less than 1 day', '1 દિવસ કરતાં ઓછો')}</option>
              <option value="1_3d">{l('1–3 days', '1–3 દિવસ')}</option>
              <option value="3_7d">{l('3–7 days', '3–7 દિવસ')}</option>
              <option value="over_week">{l('More than a week', 'એક અઠવાડિયાથી વધુ')}</option>
            </select>
            {errors.duration && <span className="aform-error">{errors.duration}</span>}
          </div>

          <div className="aform-row">
            <label className="aform-label">
              {l('Temperature', 'તાપમાન')} <span className="optional">{l('(if known)', '(જો ખ્યાલ હોય)')}</span>
            </label>
            <input
              className="aform-input"
              type="text"
              value={form.temperature}
              onChange={e => set('temperature', e.target.value)}
              placeholder={l('e.g. 101.4 °F or 38.5 °C', 'ઉ.દ. 101.4 °F અથવા 38.5 °C')}
            />
          </div>
        </div>

        <div className="aform-row">
          <label className="aform-label">
            {l('Other Symptoms', 'અન્ય લક્ષણો')} <span className="optional">{l('(optional)', '(વૈ.)')}</span>
          </label>
          <div className="aform-textarea-wrap">
            <textarea
              className="aform-textarea"
              rows={2}
              value={form.otherSymptoms}
              onChange={e => set('otherSymptoms', e.target.value)}
              placeholder={l('Any other symptoms or observations…', 'અન્ય કોઈ લક્ષણ અથવા ટિપ્પણ…')}
            />
            <button
              type="button"
              className={`aform-voice-btn ${isRecording && voiceTarget === 'otherSymptoms' ? 'aform-voice-btn--active' : ''}`}
              onClick={() =>
                isRecording && voiceTarget === 'otherSymptoms' ? stopVoice() : startVoice('otherSymptoms')
              }
              title={l('Voice input', 'અવાજ ઇનપુટ')}
            >
              {isRecording && voiceTarget === 'otherSymptoms' ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          {isRecording && voiceTarget === 'otherSymptoms' && (
            <span className="aform-listening">{t('listening', language)}</span>
          )}
        </div>

        <div className="aform-row">
          <label className="aform-label">
            {l('ASHA Notes', 'ASHA નોંધ')} <span className="optional">{l('(optional)', '(વૈ.)')}</span>
          </label>
          <textarea
            className="aform-textarea"
            rows={2}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder={l(
              'Additional observations, known conditions, medications…',
              'વધારાની ટિપ્પણ, જાણીતી બીમારી, દવા…'
            )}
          />
        </div>
      </fieldset>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="aform-actions">
        <button type="button" className="aform-btn-cancel" onClick={onCancel}>
          {l('Cancel', 'રદ કરો')}
        </button>
        <button type="submit" className="aform-btn-submit">
          <ChevronRight size={16} />
          {l('Run Preliminary Triage', 'પ્રારંભિક ટ્રાયેજ ચલાવો')}
        </button>
      </div>
    </form>
  );
};

export default AssessmentFormComponent;

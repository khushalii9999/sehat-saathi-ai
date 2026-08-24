import type { Language } from '../types';

type TranslationKey =
  | 'appName'
  | 'appTagline'
  | 'selectLanguage'
  | 'patientMode'
  | 'ashaMode'
  | 'enterSymptoms'
  | 'symptomsPlaceholder'
  | 'startAssessment'
  | 'voiceInput'
  | 'stopRecording'
  | 'listening'
  | 'triageResult'
  | 'urgencyLow'
  | 'urgencyModerate'
  | 'urgencyUrgent'
  | 'guidance'
  | 'disclaimer'
  | 'disclaimerText'
  | 'newAssessment'
  | 'followUpQuestions'
  | 'yes'
  | 'no'
  | 'next'
  | 'submit'
  | 'back'
  | 'patientName'
  | 'age'
  | 'gender'
  | 'village'
  | 'male'
  | 'female'
  | 'other'
  | 'registerPatient'
  | 'recentCases'
  | 'urgentCases'
  | 'totalCases'
  | 'dashboard'
  | 'healthcareSupport'
  | 'nearbyFacilities'
  | 'callNow'
  | 'getDirections'
  | 'escalationReason'
  | 'recommendedFollowUp'
  | 'assessedOn'
  | 'symptomsLabel'
  | 'loading'
  | 'aiPreliminaryNote'
  | 'lowPriorityDesc'
  | 'moderateDesc'
  | 'urgentDesc'
  // Patient mode — new keys
  | 'howAreYouFeeling'
  | 'patientModeIntro'
  | 'patientInfoTitle'
  | 'patientInfoSubtitle'
  | 'ageOptional'
  | 'genderOptional'
  | 'symptomDuration'
  | 'existingConditions'
  | 'currentMedications'
  | 'continueToAssessment'
  | 'skipAndContinue'
  | 'recommendedNextStep'
  | 'viewHealthcareSupport'
  | 'emergencyWarningTitle'
  | 'emergencyWarningBody'
  | 'callEmergency'
  | 'durationLess1d'
  | 'duration1to3d'
  | 'duration3to7d'
  | 'durationOverWeek'
  | 'conditionsPlaceholder'
  | 'medicationsPlaceholder';

const translations: Record<TranslationKey, Record<Language, string>> = {
  appName: { en: 'SehatSaathi AI', gu: 'સેહત સાથી AI' },
  appTagline: {
    en: 'Your Health Companion — Accessible Healthcare Guidance for Everyone',
    gu: 'તમારો સ્વાસ્થ્ય સાથી — સૌ માટે સ્વાસ્થ્ય માર્ગદર્શન',
  },
  selectLanguage: { en: 'Select Language', gu: 'ભાષા પસંદ કરો' },
  patientMode: { en: 'Patient / Family', gu: 'દર્દી / પરિવાર' },
  ashaMode: { en: 'ASHA / Health Worker', gu: 'આશા / આરોગ્ય કર્મી' },
  enterSymptoms: { en: 'Describe your symptoms', gu: 'તમારા લક્ષણો જણાવો' },
  symptomsPlaceholder: {
    en: 'Example: Fever for 2 days, headache, body pain...',
    gu: 'ઉદા: 2 દિવસથી તાવ, માથાનો દુઃખાવો, શરીરનો દુઃખાવો...',
  },
  startAssessment: { en: 'Start Assessment', gu: 'મૂલ્યાંકન શરૂ કરો' },
  voiceInput: { en: 'Voice Input', gu: 'અવાજ ઇનપુટ' },
  stopRecording: { en: 'Stop Recording', gu: 'રેકોર્ડિંગ બંધ કરો' },
  listening: { en: 'Listening...', gu: 'સાંભળી રહ્યા છીએ...' },
  triageResult: { en: 'Preliminary Triage Result', gu: 'પ્રારંભિક ટ્રાયેજ પરિણામ' },
  urgencyLow: { en: 'Low Priority', gu: 'ઓછી પ્રાથમિકતા' },
  urgencyModerate: { en: 'Medical Attention Recommended', gu: 'તબીબી સલાહ સૂચવેલ' },
  urgencyUrgent: { en: 'Urgent Attention Needed', gu: 'તત્કાળ ધ્યાન જરૂરી' },
  guidance: { en: 'Guidance', gu: 'માર્ગદર્શન' },
  disclaimer: { en: 'Important Disclaimer', gu: 'મહત્વની સૂચના' },
  disclaimerText: {
    en: 'SehatSaathi AI provides preliminary health guidance only. It does not diagnose medical conditions or replace a qualified healthcare professional.',
    gu: 'સેહત સાથી AI માત્ર પ્રારંભિક આરોગ્ય માર્ગદર્શન આપે છે. તે તબીબી સ્થિતિઓનું નિદાન કરતું નથી અથવા લાયક આરોગ્ય વ્યાવસાયિકનું સ્થાન લઈ શકતું નથી.',
  },
  newAssessment: { en: 'Start New Assessment', gu: 'નવું મૂલ્યાંકન શરૂ કરો' },
  followUpQuestions: { en: 'A Few More Questions', gu: 'થોડા વધુ પ્રશ્નો' },
  yes: { en: 'Yes', gu: 'હા' },
  no: { en: 'No', gu: 'ના' },
  next: { en: 'Next', gu: 'આગળ' },
  submit: { en: 'Submit', gu: 'સબમિટ કરો' },
  back: { en: 'Back', gu: 'પાછળ' },
  patientName: { en: 'Patient Name', gu: 'દર્દીનું નામ' },
  age: { en: 'Age', gu: 'ઉંમર' },
  gender: { en: 'Gender', gu: 'લિંગ' },
  village: { en: 'Village / Area', gu: 'ગામ / વિસ્તાર' },
  male: { en: 'Male', gu: 'પુરુષ' },
  female: { en: 'Female', gu: 'સ્ત્રી' },
  other: { en: 'Other', gu: 'અન્ય' },
  registerPatient: { en: 'Register Patient', gu: 'દર્દી નોંધો' },
  recentCases: { en: 'Recent Assessments', gu: 'તાજેતરના મૂલ્યાંકન' },
  urgentCases: { en: 'Urgent Cases', gu: 'તત્કાળ કેસ' },
  totalCases: { en: 'Total Cases', gu: 'કુલ કેસ' },
  dashboard: { en: 'Dashboard', gu: 'ડેશબોર્ડ' },
  healthcareSupport: { en: 'Healthcare Support', gu: 'આરોગ્ય સહાય' },
  nearbyFacilities: { en: 'Nearby Health Facilities', gu: 'નજીકની આરોગ્ય સુવિધાઓ' },
  callNow: { en: 'Call Now', gu: 'હવે ફોન કરો' },
  getDirections: { en: 'Get Directions', gu: 'દિશા મેળવો' },
  escalationReason: { en: 'Why This Result?', gu: 'આ પરિણામ શા માટે?' },
  recommendedFollowUp: { en: 'Recommended Follow-up', gu: 'ભલામણ કરેલ અનુવર્તન' },
  assessedOn: { en: 'Assessed on', gu: 'મૂલ્યાંકન તારીખ' },
  symptomsLabel: { en: 'Symptoms', gu: 'લક્ષણો' },
  loading: { en: 'Analysing your symptoms...', gu: 'લક્ષણો વિશ્લેષણ કરી રહ્યા છીએ...' },
  aiPreliminaryNote: {
    en: 'AI-assisted preliminary triage — not a medical diagnosis',
    gu: 'AI-સહાયિત પ્રારંભિક ટ્રાયેજ — તબીબી નિદાન નથી',
  },
  lowPriorityDesc: {
    en: 'Symptoms appear mild. Monitor at home and see a doctor if they worsen.',
    gu: 'લક્ષણો હળવા લાગે છે. ઘરે નિરીક્ષણ કરો, વધુ ખરાબ થાય તો ડૉક્ટર પાસે જાઓ.',
  },
  moderateDesc: {
    en: 'Symptoms suggest medical consultation is advisable within the next 24 hours.',
    gu: 'લક્ષણો સૂચવે છે કે આગામી 24 કલાકમાં તબીબી સલાહ લેવી ઉચિત છે.',
  },
  urgentDesc: {
    en: 'Symptoms may require urgent medical attention. Please seek care immediately.',
    gu: 'લક્ષણો ત્વરિત તબીબી સહાયની જરૂર પડી શકે છે. કૃપા કરીને તરત સહાય લો.',
  },

  // ── New Patient Mode strings ────────────────────────────────────────────────
  howAreYouFeeling: {
    en: 'How are you feeling today?',
    gu: 'આજે તમે કેવું અનુભવ કરો છો?',
  },
  patientModeIntro: {
    en: 'Tell us about your symptoms. SehatSaathi will provide preliminary guidance and help you understand the urgency of seeking medical care.',
    gu: 'અમને તમારા લક્ષણો જણાવો. સેહત સાથી પ્રારંભિક માર્ગદર્શન આપશે અને તબીબી સહાય ક્યારે અને ક્યાં લેવી તે સમજવામાં મદદ કરશે.',
  },
  patientInfoTitle: {
    en: 'Tell us a little about yourself',
    gu: 'તમારા વિશે થોડી માહિતી આપો',
  },
  patientInfoSubtitle: {
    en: 'This is optional but helps us give more accurate guidance. No sensitive data is stored.',
    gu: 'આ વૈકલ્પિક છે, પરંતુ વધુ સચોટ માર્ગદર્શન આપવામાં મદદ કરે છે. કોઈ સંવેદનશીલ ડેટા સ્ટોર થતો નથી.',
  },
  ageOptional: { en: 'Age (optional)', gu: 'ઉંમર (વૈકલ્પિક)' },
  genderOptional: { en: 'Gender (optional)', gu: 'જાતિ (વૈકલ્પિક)' },
  symptomDuration: { en: 'How long have symptoms lasted?', gu: 'લક્ષણો કેટલા સમયથી છે?' },
  existingConditions: {
    en: 'Known health conditions (optional)',
    gu: 'જાણીતી સ્વાસ્થ્ય સ્થિતિઓ (વૈકલ્પિક)',
  },
  currentMedications: {
    en: 'Current medications (optional)',
    gu: 'વર્તમાન દવાઓ (વૈકલ્પિક)',
  },
  continueToAssessment: { en: 'Continue to Assessment', gu: 'મૂલ્યાંકન ચાલુ રાખો' },
  skipAndContinue: { en: 'Skip & Continue', gu: 'છોડો અને ચાલુ રાખો' },
  recommendedNextStep: { en: 'Recommended Next Step', gu: 'ભલામણ કરેલ આગળનું પગલું' },
  viewHealthcareSupport: { en: 'View Healthcare Support', gu: 'આરોગ્ય સહાય જુઓ' },
  emergencyWarningTitle: { en: '⚠️ Potential Emergency Detected', gu: '⚠️ સંભવિત કટોકટી શોધી' },
  emergencyWarningBody: {
    en: 'Your described symptoms may indicate a serious medical emergency. Please seek immediate professional medical attention or call 108 (free ambulance service) right now.',
    gu: 'તમે વર્ણવેલા લક્ષણો ગંભીર તબીબી કટોકટી સૂચવી શકે છે. કૃપા કરીને તરત ડૉક્ટર પાસે જાઓ અથવા 108 (મફત એમ્બ્યુલન્સ) પર ફોન કરો.',
  },
  callEmergency: { en: 'Call 108 Now', gu: '108 પર ફોન કરો' },
  durationLess1d: { en: 'Less than 1 day', gu: '1 દિવસ કરતાં ઓછો' },
  duration1to3d: { en: '1–3 days', gu: '1–3 દિવસ' },
  duration3to7d: { en: '3–7 days', gu: '3–7 દિવસ' },
  durationOverWeek: { en: 'More than a week', gu: 'એક અઠવાડિયાથી વધુ' },
  conditionsPlaceholder: {
    en: 'e.g. Diabetes, hypertension, heart disease...',
    gu: 'ઉદા: ડાયાબિટીઝ, હ્રદય રોગ, ઉચ્ચ રક્ત-ચાપ...',
  },
  medicationsPlaceholder: {
    en: 'e.g. Metformin, Amlodipine...',
    gu: 'ઉદા: મેટફોર્મિન, એમ્લોડિપિન...',
  },
};

export function t(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

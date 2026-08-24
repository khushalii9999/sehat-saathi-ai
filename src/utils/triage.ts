import type {
  UrgencyLevel,
  TriageResult,
  FollowUpQuestion,
  AssessmentForm,
  AssessmentTriageResult,
  PatientInfo,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Patient Mode — keyword-based triage
// ─────────────────────────────────────────────────────────────────────────────

const urgentKeywords = [
  'chest pain', 'chest ache', 'heart', 'unconscious', 'faint',
  'breathless', 'shortness of breath', 'difficulty breathing', "can't breathe",
  'seizure', 'fits', 'convulsion', 'paralysis', "can't move",
  'severe bleeding', 'heavy bleeding', 'blood vomit', 'blood stool',
  'very high fever', 'snake bite', 'dog bite', 'accident', 'head injury',
  'severe abdominal pain', 'extreme pain',
  'છાતીમાં દુ:ખાવો', 'શ્વાસ ન આવવો', 'બેભાન', 'ખૂબ તાવ',
];

const moderateKeywords = [
  'fever', 'temperature', 'vomiting', 'diarrhea', 'loose motion', 'dehydration',
  'headache', 'body ache', 'body pain', 'joint pain', 'swelling', 'rash',
  'skin rash', 'stomach pain', 'abdominal pain', 'nausea', 'dizzy', 'dizziness',
  'weakness', 'fatigue', 'tired', 'cough', 'cold', 'sore throat',
  'burning urine', 'urinary', 'back pain', 'toothache',
  'pregnancy', 'pregnant', 'child not eating', 'malaria', 'typhoid',
  'તાવ', 'ઉલ્ટી', 'ઝાડા', 'માથું દુ:ખે', 'ઉબકા', 'ચક્કર',
];

export const followUpQuestions: FollowUpQuestion[] = [
  {
    id: 'duration',
    question: 'How long have you had these symptoms?',
    questionGu: 'આ લક્ષણો કેટલા સમયથી છે?',
    type: 'choice',
    options: ['Less than 1 day', '1–3 days', '3–7 days', 'More than a week'],
    optionsGu: ['1 દિવસ કરતાં ઓછો', '1–3 દિવસ', '3–7 દિવસ', 'એક અઠવાડિયાથી વધુ'],
  },
  {
    id: 'severity',
    question: 'How severe is the discomfort? (Scale: Mild / Moderate / Severe)',
    questionGu: 'અગવડ કેટલી ગંભીર છે? (ઓછી / મધ્યમ / ગંભીર)',
    type: 'choice',
    options: ['Mild', 'Moderate', 'Severe'],
    optionsGu: ['ઓછી', 'મધ્યમ', 'ગંભીર'],
  },
  {
    id: 'fever',
    question: 'Do you have fever?',
    questionGu: 'શું તમને તાવ છે?',
    type: 'yesno',
  },
  {
    id: 'breathing',
    question: 'Are you having any difficulty breathing?',
    questionGu: 'શું તમને શ્વાસ લેવામાં તકલીફ છે?',
    type: 'yesno',
  },
  {
    id: 'existing_condition',
    question: 'Do you have any known health condition (diabetes, heart disease, etc.)?',
    questionGu: 'શું તમને કોઈ જાણીતી સ્વાસ્થ્ય સ્થિતિ છે (ડાયાબિટીઝ, હ્રદય રોગ, વગેરે)?',
    type: 'yesno',
  },
];

/** Returns true when the symptom text contains an emergency-level keyword */
export function hasEmergencyKeywords(text: string): boolean {
  return urgentKeywords.some(kw => text.toLowerCase().includes(kw));
}

function detectUrgency(
  text: string,
  answers: Record<string, string>,
  patientInfo?: PatientInfo,
): UrgencyLevel {
  const lower = text.toLowerCase();
  if (urgentKeywords.some(kw => lower.includes(kw))) return 'urgent';
  if (answers['breathing'] === 'yes') return 'urgent';
  if (answers['severity'] === 'Severe' || answers['severity'] === 'ગંભીર') return 'urgent';
  const hasModerate = moderateKeywords.some(kw => lower.includes(kw));
  if (hasModerate) {
    // Escalate if long duration, or known condition, or age is vulnerable
    const longDuration =
      answers['duration'] === 'More than a week' ||
      answers['duration'] === 'એક અઠવાડિયાથી વધુ';
    const knownCondition =
      answers['existing_condition'] === 'yes' ||
      Boolean(patientInfo?.existingConditions?.trim());
    const age = parseInt(patientInfo?.age ?? '', 10);
    const vulnerableAge = !isNaN(age) && (age < 5 || age > 65);
    if (longDuration || knownCondition || vulnerableAge) return 'urgent';
    return 'moderate';
  }
  return 'low';
}

const patientGuidanceMap: Record<UrgencyLevel, string[]> = {
  low: [
    'Rest at home and stay hydrated.',
    'Monitor your symptoms over the next 24–48 hours.',
    'Take paracetamol for fever or pain if needed (follow dosage instructions).',
    'Eat light, easily digestible food.',
    'Visit a doctor if symptoms worsen or do not improve in 2 days.',
  ],
  moderate: [
    'Schedule a visit to your nearest Primary Health Centre (PHC) within 24 hours.',
    'Stay well-hydrated — drink water, ORS, or light soups.',
    'Avoid self-medication beyond basic paracetamol without advice.',
    'Inform your ASHA worker about your condition.',
    'Seek immediate care if any symptoms suddenly worsen.',
  ],
  urgent: [
    'Seek medical care IMMEDIATELY at the nearest hospital or emergency centre.',
    'Call 108 (Emergency Ambulance) if you are unable to travel.',
    'Do not wait — contact your ASHA worker or a family member right now.',
    'Do not give food or water if the patient is unconscious or having difficulty swallowing.',
    'Keep the patient calm and lying down while awaiting help.',
  ],
};

export function performTriage(
  symptoms: string,
  answers: Record<string, string>,
  patientInfo?: PatientInfo,
): TriageResult {
  const urgency = detectUrgency(symptoms, answers, patientInfo);

  const summaryMap: Record<UrgencyLevel, string> = {
    low: 'Based on the described symptoms, the condition appears mild at this time.',
    moderate: 'Symptoms suggest a condition that warrants medical attention in the near term.',
    urgent: 'Symptoms indicate a potentially serious situation. Immediate medical attention is strongly advised.',
  };

  const escalationMap: Record<UrgencyLevel, string | undefined> = {
    low: undefined,
    moderate: 'Symptoms suggest a possible infection or condition requiring clinical examination.',
    urgent: 'One or more symptoms indicate a potentially serious medical condition requiring immediate professional evaluation.',
  };

  return {
    urgency,
    summary: summaryMap[urgency],
    guidance: patientGuidanceMap[urgency],
    escalationReason: escalationMap[urgency],
    followUp:
      urgency === 'low'
        ? 'Monitor at home; return for assessment if symptoms change.'
        : urgency === 'moderate'
        ? 'Visit the nearest PHC within 24 hours.'
        : 'Immediate referral to hospital required.',
    disclaimer:
      'This is a preliminary triage result only and does NOT constitute a medical diagnosis. Always consult a qualified healthcare professional for proper evaluation and treatment.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASHA Mode — structured rule-based triage
// Transparent, non-diagnostic, flag-driven rules
// ─────────────────────────────────────────────────────────────────────────────

/** Additional urgent symptom keywords that can appear in free-text fields */
const ashaUrgentKeywords = [
  'not breathing', 'stopped breathing', 'choking', 'turning blue', 'cyanosis',
  'unconscious', 'collapsed', 'unresponsive', 'seizure', 'fits', 'convulsion',
  'paralysis', 'cannot move', "can't move", 'stroke', 'facial droop',
  'severe bleeding', 'heavy bleeding', 'blood vomiting', 'vomiting blood',
  'blood in stool', 'black stool', 'very high fever', 'high fever 104', 'high fever 105',
  'snake bite', 'snakebite', 'animal bite', 'head injury', 'head trauma',
  'severe burn', 'severe dehydration', 'drowning', 'electrocution',
  'poisoning', 'ingested poison',
];

const ashaModerateKeywords = [
  'fever', 'high temperature', 'vomiting', 'diarrhea', 'loose motion',
  'dehydration', 'headache', 'body ache', 'body pain', 'joint pain',
  'swelling', 'rash', 'skin rash', 'stomach pain', 'abdominal pain',
  'nausea', 'dizzy', 'dizziness', 'weakness', 'fatigue', 'persistent cough',
  'cough blood', 'blood in sputum', 'burning urine', 'urinary pain',
  'back pain', 'chest tightness', 'pregnancy', 'pregnant', 'labour',
  'child not eating', 'not eating', 'weight loss', 'night sweats',
  'pale', 'pallor', 'jaundice', 'yellow skin', 'yellow eyes',
  'swollen lymph', 'gland swelling', 'ear pain', 'ear discharge',
  'eye pain', 'eye discharge', 'toothache',
];

export interface AshaTriageInput {
  form: AssessmentForm;
}

export function performAshaTriageFromForm(form: AssessmentForm): AssessmentTriageResult {
  const mainLower = (form.mainSymptoms + ' ' + form.otherSymptoms).toLowerCase();
  const redFlagsDetected: string[] = [];

  // ── Hard red-flag checkboxes (immediate urgent) ──────────────────────────
  if (form.difficultyBreathing) redFlagsDetected.push('Difficulty breathing');
  if (form.severChestPain)      redFlagsDetected.push('Severe chest pain');
  if (form.lossOfConsciousness) redFlagsDetected.push('Loss of consciousness');
  if (form.severebleeding)      redFlagsDetected.push('Severe bleeding');

  // ── Keyword-based urgent red flags in free text ──────────────────────────
  ashaUrgentKeywords.forEach(kw => {
    if (mainLower.includes(kw)) {
      const label = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!redFlagsDetected.includes(label)) redFlagsDetected.push(label);
    }
  });

  // ── Determine urgency ────────────────────────────────────────────────────
  let urgency: UrgencyLevel;

  if (redFlagsDetected.length > 0) {
    urgency = 'urgent';
  } else {
    // Check for moderate keywords
    const hasModerate = ashaModerateKeywords.some(kw => mainLower.includes(kw));
    if (hasModerate) {
      // Escalate to urgent if duration > 1 week or patient very young/old with moderate symptoms
      const overWeek = form.duration === 'over_week';
      const age = parseInt(form.age, 10);
      const vulnerableAge = !isNaN(age) && (age < 5 || age > 65);
      urgency = (overWeek || vulnerableAge) ? 'urgent' : 'moderate';
    } else {
      urgency = 'low';
    }
  }

  // ── Build human-readable outputs ─────────────────────────────────────────
  const summaryMap: Record<UrgencyLevel, string> = {
    low: 'Based on the recorded information, the patient\'s condition appears mild at this time. No immediate red flags were identified.',
    moderate: 'The recorded symptoms suggest the patient should receive medical attention. A visit to the nearest health facility is recommended within 24 hours.',
    urgent: 'One or more serious warning signs were recorded. Urgent medical evaluation is recommended. Please refer the patient to the nearest facility or call 108 immediately.',
  };

  const escalationReasonMap: Record<UrgencyLevel, string> = {
    low: 'No escalation required at this time. Continue monitoring.',
    moderate: 'Symptoms indicate a possible health condition that requires clinical examination and professional assessment.',
    urgent: redFlagsDetected.length > 0
      ? `The following warning signs were recorded and require immediate attention: ${redFlagsDetected.join(', ')}.`
      : 'Symptom pattern and patient profile indicate a potentially serious condition requiring immediate professional evaluation.',
  };

  const nextStepMap: Record<UrgencyLevel, string> = {
    low: 'Advise home rest, adequate fluids, and monitoring. Schedule a routine follow-up if symptoms persist beyond 48 hours.',
    moderate: 'Refer patient to the nearest Primary Health Centre (PHC) within 24 hours. Provide ORS if dehydration is present.',
    urgent: 'Refer patient to the nearest hospital or Community Health Centre (CHC) IMMEDIATELY. Call 108 ambulance service if the patient cannot travel.',
  };

  const followUpMap: Record<UrgencyLevel, string> = {
    low: 'Re-assess in 48 hours. If symptoms worsen or new symptoms appear, escalate to PHC.',
    moderate: 'Follow up within 24–48 hours to confirm PHC visit and review outcome.',
    urgent: 'Confirm hospital arrival. Document outcome and update case record.',
  };

  return {
    urgency,
    summary: summaryMap[urgency],
    redFlagsDetected,
    escalationReason: escalationReasonMap[urgency],
    recommendedNextStep: nextStepMap[urgency],
    followUpRecommendation: followUpMap[urgency],
    disclaimer:
      'This is a preliminary triage assessment generated by a rule-based prototype tool. It does NOT constitute a medical diagnosis and should NOT replace clinical judgment. All cases must be reviewed by a qualified healthcare professional.',
  };
}

/** Generate a short case ID like SS-2025-042 */
export function generateCaseId(existingCount: number): string {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(3, '0');
  return `SS-${year}-${seq}`;
}

/** Duration label for display */
export const durationLabels: Record<string, string> = {
  less_1d: 'Less than 1 day',
  '1_3d': '1–3 days',
  '3_7d': '3–7 days',
  over_week: 'More than a week',
};

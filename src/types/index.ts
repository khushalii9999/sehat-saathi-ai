export type Language = 'en' | 'gu';

export type UrgencyLevel = 'low' | 'moderate' | 'urgent';

export type UserRole = 'patient' | 'asha';

// ─── Patient Mode ────────────────────────────────────────────────────────────

/** Optional patient context collected before triage */
export interface PatientInfo {
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  symptomDuration: string;   // 'less_1d' | '1_3d' | '3_7d' | 'over_week' | ''
  existingConditions: string;
  currentMedications: string;
}


export interface TriageResult {
  urgency: UrgencyLevel;
  summary: string;
  guidance: string[];
  escalationReason?: string;
  followUp?: string;
  disclaimer: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  questionGu: string;
  type: 'yesno' | 'choice' | 'number';
  options?: string[];
  optionsGu?: string[];
}

// ─── ASHA Mode — structured assessment form ─────────────────────────────────

export interface AssessmentForm {
  // Patient info
  patientName: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  village: string;
  patientId: string;

  // Symptoms
  mainSymptoms: string;
  duration: string;            // 'less_1d' | '1_3d' | '3_7d' | 'over_week'
  temperature: string;         // free text, e.g. "101.4 F"

  // Red-flag checkboxes
  difficultyBreathing: boolean;
  severChestPain: boolean;
  lossOfConsciousness: boolean;
  severebleeding: boolean;

  // Additional
  otherSymptoms: string;
  notes: string;
}

export interface AssessmentTriageResult {
  urgency: UrgencyLevel;
  summary: string;
  redFlagsDetected: string[];
  escalationReason: string;
  recommendedNextStep: string;
  followUpRecommendation: string;
  disclaimer: string;
}

export interface PatientCase {
  id: string;                    // e.g. "SS-2025-001"
  isDemo?: boolean;

  // Patient info
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  village: string;
  patientId?: string;

  // Recorded symptoms
  mainSymptoms: string;
  duration?: string;
  temperature?: string;
  difficultyBreathing?: boolean;
  severChestPain?: boolean;
  lossOfConsciousness?: boolean;
  severebleeding?: boolean;
  otherSymptoms?: string;
  notes?: string;

  // Legacy field — kept for backward compat with patient mode display
  symptoms: string;

  // Triage output
  urgency: UrgencyLevel;
  triageResult?: AssessmentTriageResult;
  escalationReason?: string;
  followUp?: string;

  // Meta
  assessedAt: string;
  ashaName: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'phc' | 'chc' | 'hospital' | 'asha';
  address: string;
  distance: string;
  phone: string;
  timings: string;
  services: string[];
}

export interface DashboardStats {
  totalCases: number;
  lowPriority: number;
  moderate: number;
  urgent: number;
}

import { useState, useEffect } from 'react';
import type { PatientCase } from '../types';
import { DEMO_CASES } from '../data/mockData';

const STORAGE_KEY = 'sehatsaathi_cases_v2';

function loadCases(): PatientCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: PatientCase[] = JSON.parse(raw);
      // Merge: keep demo cases that aren't overridden, prepend any live cases
      const liveIds = new Set(parsed.map(c => c.id));
      const missingDemos = DEMO_CASES.filter(d => !liveIds.has(d.id));
      return [...parsed.filter(c => !c.isDemo), ...missingDemos];
    }
  } catch {
    // ignore parse errors
  }
  return [...DEMO_CASES];
}

function saveCases(cases: PatientCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch {
    // ignore quota errors in demo
  }
}

export function useCases() {
  const [cases, setCasesState] = useState<PatientCase[]>(loadCases);

  // persist whenever cases change
  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  const addCase = (newCase: PatientCase) => {
    setCasesState(prev => {
      const updated = [newCase, ...prev];
      return updated;
    });
  };

  const resetToDemo = () => {
    setCasesState([...DEMO_CASES]);
  };

  return { cases, addCase, resetToDemo };
}

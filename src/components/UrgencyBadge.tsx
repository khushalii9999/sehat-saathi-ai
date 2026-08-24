import React from 'react';
import type { UrgencyLevel } from '../types';
import './UrgencyBadge.css';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  large?: boolean;
}

const labels: Record<UrgencyLevel, string> = {
  low: 'Low Priority',
  moderate: 'Medical Attention Recommended',
  urgent: 'Urgent Attention Needed',
};

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, large = false }) => {
  return (
    <span className={`urgency-badge urgency-${level} ${large ? 'urgency-badge--large' : ''}`}>
      <span className="urgency-dot" />
      {labels[level]}
    </span>
  );
};

export default UrgencyBadge;

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  tint: 'blue' | 'red' | 'orange' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  icon: Icon,
  tint,
}) => {
  const stylesByTint = {
    blue: {
      bg: '#eff6ff',
      iconColor: '#2563eb',
      border: '#dbeafe',
    },
    red: {
      bg: '#fef2f2',
      iconColor: '#dc2626',
      border: '#fee2e2',
    },
    orange: {
      bg: '#fff7ed',
      iconColor: '#ea580c',
      border: '#ffedd5',
    },
    purple: {
      bg: '#faf5ff',
      iconColor: '#9333ea',
      border: '#f3e8ff',
    },
  }[tint];

  return (
    <div
      className="card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: stylesByTint.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: stylesByTint.iconColor,
          flexShrink: 0,
        }}
      >
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '12.5px',
            fontWeight: 500,
            color: '#64748b',
            marginTop: '4px',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

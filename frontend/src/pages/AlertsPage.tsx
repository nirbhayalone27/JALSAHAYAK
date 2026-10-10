import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { MAHARASHTRA_ALERTS, DamAlert } from '../data/alerts';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';

interface AlertsPageProps {
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  onSelectDam,
  onNavigate,
}) => {
  const [activeSeverity, setActiveSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>('alt-01');

  const filteredAlerts = MAHARASHTRA_ALERTS.filter((alt) => {
    if (activeSeverity === 'All') return true;
    if (activeSeverity === 'High') return alt.severity === 'High';
    if (activeSeverity === 'Medium') return alt.severity === 'Medium';
    if (activeSeverity === 'Low') return alt.severity === 'Low' || alt.severity === 'Update';
    return true;
  });

  const handleDamClick = (damId: string) => {
    const dam = MAHARASHTRA_DAMS.find((d) => d.id === damId);
    if (dam) {
      onSelectDam(dam);
      onNavigate('dam-detail');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Title */}
      <div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.025em',
          }}
        >
          Alerts
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Important alerts and evidence-backed notifications from monitored Maharashtra dams
        </p>
      </div>

      {/* Severity Tabs matching Reference Image 2 Screen 8 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        {(['All', 'High', 'Medium', 'Low'] as const).map((tab) => {
          const isActive = activeSeverity === tab;
          const label = tab === 'All' ? 'All' : `${tab} Risk`;
          return (
            <button
              key={tab}
              onClick={() => setActiveSeverity(tab)}
              style={{
                border: 'none',
                background: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Alerts Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.map((alt) => {
          const isExpanded = expandedAlertId === alt.id;
          const isHigh = alt.severity === 'High';
          const isMed = alt.severity === 'Medium';

          return (
            <div
              key={alt.id}
              className="card"
              style={{
                padding: '16px 20px',
                borderLeft: `4px solid ${isHigh ? '#ef4444' : isMed ? '#f97316' : '#0284c7'}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
              }}
              onClick={() => setExpandedAlertId(isExpanded ? null : alt.id)}
            >
              {/* Card Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isHigh ? '#fef2f2' : isMed ? '#fff7ed' : '#eff6ff',
                      color: isHigh ? '#dc2626' : isMed ? '#ea580c' : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isHigh || isMed ? <AlertTriangle size={18} /> : <Info size={18} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                        {alt.damName}
                      </span>
                      <span style={{ color: '#94a3b8' }}>—</span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: isHigh ? '#dc2626' : isMed ? '#ea580c' : '#0284c7',
                        }}
                      >
                        {alt.severity === 'Update' ? 'Update' : `${alt.severity} Risk`}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                      {alt.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{alt.timeAgo}</span>
                  <ChevronRight
                    size={18}
                    color="#94a3b8"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.15s',
                    }}
                  />
                </div>
              </div>

              {/* Expanded Detail (WHAT, WHEN, WHERE, WHY & Action) */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    fontSize: '13px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>WHAT</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{alt.title}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>WHEN</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{alt.timestamp}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>WHERE</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{alt.district} District</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>STATUS</span>
                      <span style={{ fontWeight: 600, color: '#dc2626' }}>{alt.status}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      Evidence & Scientific Reason:
                    </span>
                    <p style={{ color: '#334155', lineHeight: 1.5 }}>{alt.reason}</p>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                      Supporting Trigger: <b>{alt.evidence.metric}</b>: {alt.evidence.value} (Threshold: {alt.evidence.threshold})
                    </div>
                  </div>

                  <div style={{ padding: '10px 14px', backgroundColor: '#fff7ed', borderRadius: '6px', border: '1px solid #ffedd5' }}>
                    <span style={{ fontWeight: 700, color: '#c2410c', fontSize: '12px', display: 'block', marginBottom: '2px' }}>
                      Recommended Action:
                    </span>
                    <p style={{ color: '#9a3412', fontSize: '12.5px' }}>{alt.recommendedAction}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                    <button
                      onClick={() => handleDamClick(alt.damId)}
                      className="btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Inspect {alt.damName} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { X, Download, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { MonitoringReport } from '../data/reports';

interface ReportModalProps {
  report: MonitoringReport | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                {report.reportCode}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {report.damName} • Period: {report.period}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <Download size={14} /> Export PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status & Timestamp Banner */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>Assigned Status: </span>
              <span className={`badge badge-${report.monitoringStatus.toLowerCase()}`} style={{ marginLeft: '6px' }}>
                ● {report.monitoringStatus}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '12px' }}>
              Generated: {report.generatedAt}
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              1. Executive Summary
            </h4>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              {report.summary}
            </p>
          </div>

          {/* Observations & Detected Changes */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              2. Satellite Observations & Change Evidence
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', fontSize: '12.5px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Latest Date: </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{report.latestObservation}</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Previous Date: </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{report.previousObservation}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                DETECTED DELTAS:
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.detectedChanges.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Status Reasons */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3. Status Justification & Triggers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.statusReasons.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <CheckCircle2 size={15} color="#0284c7" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flood Simulation Summary if present */}
          {report.scenarioDetails && (
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                4. Dam-Break Scenario Analysis
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Inundation Area</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{report.scenarioDetails.inundatedAreaSqKm} km²</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Max Inundation Depth</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#dc2626' }}>{report.scenarioDetails.maxDepthM} m</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Downstream Settlements</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{report.scenarioDetails.affectedVillages} Towns/Villages</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Sources Provenance */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
              Data Sources & Provenance
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {report.evidenceSources.map((source, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* Mandatory Scientific Limitations */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#fffbeb',
              borderRadius: '8px',
              border: '1px solid #fef3c7',
              display: 'flex',
              gap: '10px',
            }}
          >
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                Official Scientific & Operational Limitations
              </div>
              <ul style={{ paddingLeft: '16px', fontSize: '11.5px', color: '#92400e', lineHeight: 1.5 }}>
                {report.officialLimitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={onClose} className="btn-secondary" style={{ padding: '7px 16px' }}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

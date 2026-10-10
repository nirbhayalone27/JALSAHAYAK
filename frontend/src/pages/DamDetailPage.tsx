import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar, AlertTriangle, Layers, Activity, FileText } from 'lucide-react';
import { MaharashtraDam } from '../data/dams';
import { MaharashtraMap } from '../components/MaharashtraMap';

interface DamDetailPageProps {
  dam: MaharashtraDam;
  onNavigate: (page: string) => void;
}

export const DamDetailPage: React.FC<DamDetailPageProps> = ({ dam, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'satellite' | 'simulation' | 'impact' | 'reports' | 'alerts'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'impact', label: 'Impact' },
    { id: 'reports', label: 'Reports' },
    { id: 'alerts', label: 'Alerts' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748b' }}>
        <button
          onClick={() => onNavigate('dams')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12.5px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Maharashtra Dams
        </button>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{dam.name}</span>
      </div>

      {/* Title Header with Status Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {dam.name}
            </h1>
            <span className={`badge badge-${dam.monitoringStatus.toLowerCase()}`} style={{ fontSize: '12px' }}>
              ● {dam.monitoringStatus}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
            {dam.detectedChange}
          </p>
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>
          <div>Last updated</div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{dam.lastObservation}, 10:30 AM</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Reference Image */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          gap: '4px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'satellite') onNavigate('satellite');
                else if (tab.id === 'simulation') onNavigate('simulation');
                else if (tab.id === 'impact') onNavigate('impact');
                else if (tab.id === 'reports') onNavigate('reports');
                else if (tab.id === 'alerts') onNavigate('alerts');
                else setActiveTab(tab.id as any);
              }}
              style={{
                border: 'none',
                background: 'none',
                padding: '10px 18px',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0284c7' : '#64748b',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.12s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content: Map (Left) & Dam Information Panel (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.7fr 1fr',
          gap: '20px',
          minHeight: '480px',
        }}
      >
        {/* Left Map View */}
        <div className="card" style={{ overflow: 'hidden', minHeight: '460px' }}>
          <MaharashtraMap
            selectedDam={dam}
            zoomLevel={10}
            height="100%"
          />
        </div>

        {/* Right Info Card matching Reference Image Screen 3 */}
        <div
          className="card"
          style={{
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
              Dam Information
            </h3>

            {/* Dam Photo Banner */}
            {dam.imageUrl && (
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={dam.imageUrl}
                  alt={dam.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = `/assets/dams/${dam.id}.svg`;
                  }}
                />
              </div>
            )}

            {/* Spec List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>River</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.river}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>State</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.state}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>District</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.district}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Type</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.damType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Height</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.heightM} m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Storage Capacity</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.capacityMCM} MCM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Current Level</span>
                <span style={{ fontWeight: 700, color: dam.currentLevelPct > 90 ? '#ef4444' : '#0284c7' }}>
                  {dam.currentLevelPct}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Last Observation</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.lastObservation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Previous Observation</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{dam.previousObservation}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '12px' }}>Detected Change:</span>
                <span style={{ fontWeight: 600, color: '#ea580c', backgroundColor: '#fff7ed', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                  {dam.detectedChange}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onNavigate('satellite')}
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Compare Satellite Dates →
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className="btn-secondary"
              style={{ width: '100%', padding: '9px', justifyContent: 'center' }}
            >
              Run Dam-Break Simulation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

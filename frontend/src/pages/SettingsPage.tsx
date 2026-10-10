import React, { useState } from 'react';
import { User, Bell, Database, Palette, Shield, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'dataSources' | 'appearance'>('profile');

  // Form State
  const [name, setName] = useState('Nirbhay Alone');
  const [email, setEmail] = useState('nirbhay@example.com');
  const [role, setRole] = useState('Lead Risk Analyst');
  const [organization, setOrganization] = useState('Bharati Vidyapeeth CCEP / WRD Maharashtra');
  const [savedMessage, setSavedMessage] = useState(false);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    monitoringChanges: true,
    newSatelliteObs: true,
    reportGenerated: false,
  });

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
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
          Settings
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Manage your account and platform preferences
        </p>
      </div>

      {/* Tabs matching Reference Screen 9 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'dataSources', label: 'Data Sources' },
          { id: 'appearance', label: 'Appearance' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Body */}
      <div className="card" style={{ padding: '24px', maxWidth: '720px' }}>
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* User Avatar Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                  }}
                >
                  N
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '7px 14px' }}
              >
                {savedMessage ? <Check size={14} /> : 'Save Profile'}
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Notification Subscriptions
            </h3>
            {[
              { key: 'highRiskAlerts', label: 'High-risk dam threshold alerts', desc: 'Instant alerts when reservoir level exceeds 95% or Karad/Pune risk is high.' },
              { key: 'monitoringChanges', label: 'Monitoring change notifications', desc: 'Alerts when optical change detection finds >10% area expansion.' },
              { key: 'newSatelliteObs', label: 'New satellite observation ingested', desc: 'Notify when new Copernicus Sentinel-2 MSI tile is ingested.' },
              { key: 'reportGenerated', label: 'Automatic monitoring report compiled', desc: 'Weekly/monthly report compilation notifications.' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof notifications],
                    }))
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dataSources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Connected Data Ingestion Sources
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'India-WRIS Dam Inventory', status: 'Active (Ingested)', provider: 'Ministry of Jal Shakti, GoI', freq: 'Quarterly' },
                { name: 'Maharashtra WRD Telemetry', status: 'Active (Demo Fallback)', provider: 'Water Resources Dept, Govt. of Maharashtra', freq: 'Daily' },
                { name: 'Copernicus Sentinel-2 MSI', status: 'Active (Optical 10m)', provider: 'European Space Agency (ESA)', freq: '5 days revisit' },
                { name: 'NASA SRTM DEM 30m', status: 'Active (Baseline Terrain)', provider: 'USGS / NASA Earthdata', freq: 'Static DEM' },
              ].map((src, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#0f172a' }}>{src.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{src.provider} • Frequency: {src.freq}</div>
                  </div>
                  <span className="badge badge-normal" style={{ fontSize: '11px' }}>
                    {src.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Visual & Theme Configuration
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              In accordance with design specifications, JalSahayak operates with the authoritative clean white/light theme and blue civil-engineering color palette matching Maharashtra State Water Resources Department standards.
            </p>
            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Current Theme: </span>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>Clean Civil Light (Locked)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

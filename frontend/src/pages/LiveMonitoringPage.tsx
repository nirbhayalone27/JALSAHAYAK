import React, { useState } from 'react';
import { RefreshCw, Radio, Info, ExternalLink } from 'lucide-react';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';

interface LiveMonitoringPageProps {
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  onSelectDam,
  onNavigate,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked('Just now');
    }, 600);
  };

  const handleViewDam = (dam: MaharashtraDam) => {
    onSelectDam(dam);
    onNavigate('dam-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Live Monitoring
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Latest observations across monitored Maharashtra dams.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Last checked: {lastChecked}
          </span>
          <button
            onClick={handleRefresh}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Prototype Honesty Notice */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          color: '#1e40af',
        }}
      >
        <Info size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 600 }}>Prototype Monitoring Data: </span>
          Observations are synthesized from recent Copernicus Sentinel-2 MSI overpasses and WRD reservoir storage bulletins. Real-time CWC IoT telemetry integrates progressively in Phase 2.
        </div>
      </div>

      {/* Live Monitoring Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Dam Name</th>
                <th>District / River</th>
                <th>Last Observation</th>
                <th>Observed Change</th>
                <th>Status</th>
                <th>Source Quality</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MAHARASHTRA_DAMS.map((dam) => (
                <tr key={dam.id}>
                  <td>
                    <div
                      onClick={() => handleViewDam(dam)}
                      style={{
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {dam.name}
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    {dam.district} • {dam.river}
                  </td>
                  <td style={{ color: '#0f172a', fontWeight: 500 }}>
                    {dam.lastObservation}
                  </td>
                  <td style={{ maxWidth: '320px' }}>
                    <span style={{ color: dam.monitoringStatus === 'WATCH' ? '#ea580c' : '#475569', fontWeight: dam.monitoringStatus === 'WATCH' ? 600 : 400 }}>
                      {dam.detectedChange}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${dam.monitoringStatus.toLowerCase()}`}>
                      ● {dam.monitoringStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 7px', borderRadius: '4px' }}>
                      Sentinel-2 (10m) / Good
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewDam(dam)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

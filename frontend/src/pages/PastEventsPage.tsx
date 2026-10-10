import React, { useState } from 'react';
import { Calendar, Filter, FileText, ArrowUpDown } from 'lucide-react';
import { PAST_EVENTS, MonitoringEvent } from '../data/events';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';

interface PastEventsPageProps {
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const PastEventsPage: React.FC<PastEventsPageProps> = ({
  onSelectDam,
  onNavigate,
}) => {
  const [selectedDamName, setSelectedDamName] = useState('All Dams');
  const [selectedEventType, setSelectedEventType] = useState('All Types');

  const filteredEvents = PAST_EVENTS.filter((evt) => {
    if (selectedDamName !== 'All Dams' && evt.damName !== selectedDamName) return false;
    if (selectedEventType !== 'All Types' && evt.eventType !== selectedEventType) return false;
    return true;
  });

  const handleDamClick = (damName: string) => {
    const dam = MAHARASHTRA_DAMS.find((d) => d.name === damName);
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
          Past Monitoring Events
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Historical anomalies and satellite change detections for Maharashtra dams
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Dam:</span>
          <select
            value={selectedDamName}
            onChange={(e) => setSelectedDamName(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <option value="All Dams">All Dams</option>
            {Array.from(new Set(PAST_EVENTS.map((e) => e.damName))).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Event Type:</span>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <option value="All Types">All Event Types</option>
            <option value="Satellite change detected">Satellite change detected</option>
            <option value="High inflow">High inflow</option>
            <option value="Water spread change">Water spread change</option>
            <option value="Flood scenario analysed">Flood scenario analysed</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Date</th>
                <th>Dam Name</th>
                <th>District / Location</th>
                <th>Event Type</th>
                <th>Change Summary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id}>
                  <td style={{ color: '#64748b', fontWeight: 500 }}>{evt.date}</td>
                  <td>
                    <span
                      onClick={() => handleDamClick(evt.damName)}
                      style={{
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {evt.damName}
                    </span>
                  </td>
                  <td style={{ color: '#475569' }}>
                    {evt.district} • {evt.location}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {evt.eventType}
                    </span>
                  </td>
                  <td style={{ maxWidth: '320px', color: '#1e293b' }}>
                    {evt.changeSummary}
                  </td>
                  <td>
                    <span className={`badge badge-${evt.status.toLowerCase()}`}>
                      ● {evt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onNavigate('reports')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FileText size={14} /> View
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

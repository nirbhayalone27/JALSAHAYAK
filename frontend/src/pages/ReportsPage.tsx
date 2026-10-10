import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';
import { MONITORING_REPORTS, MonitoringReport } from '../data/reports';
import { ReportModal } from '../components/ReportModal';

interface ReportsPageProps {
  onNavigate: (page: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Reports');
  const [selectedReport, setSelectedReport] = useState<MonitoringReport | null>(null);

  const categories = ['All Reports', 'Monthly', 'Event Based', 'Simulation Reports'];

  const filteredReports = MONITORING_REPORTS.filter((rep) => {
    if (activeCategory === 'All Reports') return true;
    return rep.category === activeCategory;
  });

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
          Monitoring Reports
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Automatically generated reports for monitored Maharashtra dams
        </p>
      </div>

      {/* Tabs matching Reference Image 2 Screen 7 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
              {cat}
            </button>
          );
        })}
      </div>

      {/* Reports Table matching Reference Screen 7 */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Report Code</th>
                <th>Dam Name</th>
                <th>Monitoring Period</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((rep) => (
                <tr key={rep.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#0284c7" />
                      <span>{rep.reportCode}</span>
                    </div>
                  </td>
                  <td style={{ color: '#334155', fontWeight: 500 }}>{rep.damName}</td>
                  <td style={{ color: '#64748b' }}>{rep.period}</td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                      {rep.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600, backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                      ● {rep.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedReport(rep)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: '4px 10px',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Report Inspection Modal */}
      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};

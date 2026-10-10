import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import {
  MAHARASHTRA_DAMS,
  MAHARASHTRA_DISTRICTS,
  MAHARASHTRA_RIVERS,
  MAHARASHTRA_DAM_TYPES,
  MaharashtraDam,
} from '../data/dams';

interface DamsPageProps {
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const DamsPage: React.FC<DamsPageProps> = ({ onSelectDam, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All Districts');
  const [river, setRiver] = useState('All Rivers');
  const [risk, setRisk] = useState('All Risk Levels');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredDams = useMemo(() => {
    return MAHARASHTRA_DAMS.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.river.toLowerCase().includes(q) &&
          !d.district.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (district !== 'All Districts' && d.district !== district) return false;
      if (river !== 'All Rivers' && !d.river.toLowerCase().includes(river.toLowerCase())) return false;
      if (risk !== 'All Risk Levels' && d.riskLevel !== risk) return false;
      return true;
    });
  }, [search, district, river, risk]);

  const totalPages = Math.ceil(filteredDams.length / itemsPerPage) || 1;
  const paginatedDams = filteredDams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDam = (dam: MaharashtraDam) => {
    onSelectDam(dam);
    onNavigate('dam-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Title & Action */}
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
            Maharashtra Dams
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            View and manage monitored dams across Maharashtra
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => alert('New Maharashtra Dam registration modal will be enabled in Phase 2.')}
        >
          <Plus size={16} /> Add Dam
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search dam name, river or district..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              backgroundColor: '#f8fafc',
            }}
          />
        </div>

        {/* District Filter */}
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            cursor: 'pointer',
          }}
        >
          <option value="All Districts">All Districts</option>
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* River Filter */}
        <select
          value={river}
          onChange={(e) => {
            setRiver(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            cursor: 'pointer',
          }}
        >
          <option value="All Rivers">All Rivers</option>
          {MAHARASHTRA_RIVERS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Risk Level Filter */}
        <select
          value={risk}
          onChange={(e) => {
            setRisk(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            cursor: 'pointer',
          }}
        >
          <option value="All Risk Levels">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {/* Main Dams Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Dam Name</th>
                <th>River</th>
                <th>District</th>
                <th>Height (m)</th>
                <th>Current Level (%)</th>
                <th>Risk Level</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDams.length > 0 ? (
                paginatedDams.map((dam, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={dam.id}>
                      <td style={{ color: '#94a3b8', fontWeight: 500 }}>{rowNumber}</td>
                      <td>
                        <div
                          onClick={() => handleViewDam(dam)}
                          style={{
                            fontWeight: 600,
                            color: '#0f172a',
                            cursor: 'pointer',
                            display: 'inline-block',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                        >
                          {dam.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {dam.damType}
                        </div>
                      </td>
                      <td style={{ color: '#475569' }}>{dam.river}</td>
                      <td style={{ color: '#475569' }}>{dam.district}</td>
                      <td style={{ color: '#0f172a', fontWeight: 600 }}>{dam.heightM}</td>
                      <td style={{ minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '12px', minWidth: '40px' }}>
                            {dam.currentLevelPct}%
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: '6px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${dam.currentLevelPct}%`,
                                height: '100%',
                                backgroundColor:
                                  dam.currentLevelPct > 90
                                    ? '#ef4444'
                                    : dam.currentLevelPct > 75
                                    ? '#f59e0b'
                                    : '#10b981',
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${dam.riskLevel.toLowerCase()}`}>
                          ● {dam.riskLevel}
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
                            cursor: 'pointer',
                            fontSize: '13px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No Maharashtra dam matches the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching reference screenshot */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredDams.length)} of {filteredDams.length} Maharashtra dams
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
              }}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: currentPage === i + 1 ? '#0284c7' : '#e2e8f0',
                  backgroundColor: currentPage === i + 1 ? '#0284c7' : '#ffffff',
                  color: currentPage === i + 1 ? '#ffffff' : '#475569',
                  fontWeight: currentPage === i + 1 ? 600 : 400,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '12px',
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

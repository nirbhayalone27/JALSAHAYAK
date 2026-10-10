import React, { useState, useEffect } from 'react';
import {
  Layers,
  Calendar,
  ArrowRight,
  Eye,
  AlertCircle,
  Info,
  CheckCircle,
  Database,
  Satellite as SatelliteIcon,
} from 'lucide-react';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';
import {
  SatelliteObservation,
  DetectedChange,
  getObservationsForDam,
  calculateSatelliteChange,
} from '../data/observations';
import { SatelliteComparisonMap } from '../components/SatelliteComparisonMap';
import { useTranslation } from '../context/LanguageContext';

interface SatellitePageProps {
  selectedDam: MaharashtraDam;
  onSelectDam: (dam: MaharashtraDam) => void;
}

export const SatellitePage: React.FC<SatellitePageProps> = ({
  selectedDam,
  onSelectDam,
}) => {
  const { t } = useTranslation();

  // Dynamic observations catalog for currently selected dam
  const damObservations = getObservationsForDam(selectedDam.id);
  const availableDates = damObservations.map((o) => o.date);

  const [dateA, setDateA] = useState<string>(
    damObservations[2]?.date || '04 Oct 2026'
  );
  const [dateB, setDateB] = useState<string>(
    damObservations[3]?.date || '08 Oct 2026'
  );
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'sideBySide'>('split');

  // Synchronize dates when selected dam changes
  useEffect(() => {
    const obs = getObservationsForDam(selectedDam.id);
    if (obs.length >= 4) {
      setDateA(obs[2].date);
      setDateB(obs[3].date);
      setSliderPos(50);
    }
  }, [selectedDam.id]);

  const obsA =
    damObservations.find((o) => o.date === dateA) ||
    damObservations[2] ||
    damObservations[0];
  const obsB =
    damObservations.find((o) => o.date === dateB) ||
    damObservations[3] ||
    damObservations[1] ||
    damObservations[0];

  // Evidence-based change detection derived from comparable observations
  const detectedChanges = calculateSatelliteChange(selectedDam, obsA, obsB);

  const handleSelectDate = (date: string, target: 'A' | 'B') => {
    if (target === 'A') setDateA(date);
    else setDateB(date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Title Header with Mission Source Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.025em',
              }}
            >
              Satellite Monitoring &amp; Earth Observation
            </h1>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(2, 132, 199, 0.12)',
                color: '#0284c7',
                border: '1px solid rgba(2, 132, 199, 0.3)',
              }}
            >
              SENTINEL-2 MSI L2A
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Compare multi-date satellite observations over {selectedDam.name} ({selectedDam.river} River, {selectedDam.district} District)
          </p>
        </div>

        {/* Sensor & Provider Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
          }}
        >
          <SatelliteIcon size={14} color="#0284c7" />
          <span>ESA Copernicus Data Space Ecosystem</span>
        </div>
      </div>

      {/* Top Selectors Toolbar */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Select Dam */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Select Dam:
            </span>
            <select
              value={selectedDam.id}
              onChange={(e) => {
                const dam = MAHARASHTRA_DAMS.find((d) => d.id === e.target.value);
                if (dam) onSelectDam(dam);
              }}
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {MAHARASHTRA_DAMS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.district})
                </option>
              ))}
            </select>
          </div>

          {/* Date A (Baseline) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Date A (Baseline):
            </span>
            <select
              value={dateA}
              onChange={(e) => setDateA(e.target.value)}
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Date B (Latest) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Date B (Latest):
            </span>
            <select
              value={dateB}
              onChange={(e) => setDateB(e.target.value)}
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('split')}
            className={viewMode === 'split' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12.5px', padding: '6px 12px' }}
          >
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={viewMode === 'sideBySide' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12.5px', padding: '6px 12px' }}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Comparison Display & Evidence-Based Changes Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1fr', gap: '20px' }}>
        {/* Real Geospatial Satellite Comparison Viewer */}
        <div
          className="card"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '480px',
          }}
        >
          {/* MapLibre GL Aligned Satellite Viewer */}
          <SatelliteComparisonMap
            dam={selectedDam}
            observationA={obsA}
            observationB={obsB}
            sliderPos={sliderPos}
            onSliderChange={setSliderPos}
            viewMode={viewMode}
            onSelectDate={handleSelectDate}
          />

          {/* Interactive Range Slider Scrubber Control */}
          {viewMode === 'split' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
                <span>{dateA} (Baseline)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#0284c7', cursor: 'ew-resize', height: '6px' }}
                title="Drag split comparison divider"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#0284c7', fontWeight: 700 }}>
                <span>{dateB} (Latest)</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Evidence-Based Detected Changes Panel */}
        <div
          className="card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                Detected Changes
              </h3>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                }}
              >
                DEMO ESTIMATE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {detectedChanges.map((chg) => (
                <div
                  key={chg.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor:
                      chg.severity === 'high'
                        ? 'rgba(239, 68, 68, 0.06)'
                        : chg.severity === 'moderate'
                        ? 'rgba(249, 115, 22, 0.06)'
                        : 'var(--bg-panel)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            chg.severity === 'high'
                              ? '#ef4444'
                              : chg.severity === 'moderate'
                              ? '#f97316'
                              : '#10b981',
                        }}
                      />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {chg.title}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {chg.classification.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '4px' }}>
                    {chg.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span>Delta: <b>{chg.areaDeltaSqKm >= 0 ? `+${chg.areaDeltaSqKm}` : chg.areaDeltaSqKm} km² ({chg.pctChange >= 0 ? `+${chg.pctChange}` : chg.pctChange}%)</b></span>
                    <span>Confidence: <b>{(chg.confidence * 100).toFixed(0)}%</b></span>
                  </div>

                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                    Method: {chg.methodology}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Disclaimer Note */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-panel)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
            }}
          >
            <b>Scientific Protocol Note:</b> Multi-date reflectance deltas capture surface water spread variations across reservoir bays. Satellite optical imagery does <u>NOT</u> detect internal structural dam foundation integrity; in-situ geotechnical instrumentation is required.
          </div>
        </div>
      </div>

      {/* Available Dates Timeline Bar at Bottom */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>Available Copernicus Passes:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {damObservations.map((obs) => {
            const isSelected = obs.date === dateB;
            const isBase = obs.date === dateA;
            const isCloudy = obs.quality === 'Cloudy';

            return (
              <button
                key={obs.id}
                onClick={() => setDateB(obs.date)}
                title={`${obs.date}: ${obs.mission} (Cloud: ${obs.cloudCoverPct}%)`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isSelected || isBase ? 700 : 500,
                  border: isSelected
                    ? '1px solid #0284c7'
                    : isBase
                    ? '1px solid #38bdf8'
                    : '1px solid var(--border-color)',
                  backgroundColor: isSelected
                    ? '#0284c7'
                    : isBase
                    ? 'rgba(56, 189, 248, 0.15)'
                    : isCloudy
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'var(--bg-card)',
                  color: isSelected
                    ? '#ffffff'
                    : isBase
                    ? '#0284c7'
                    : isCloudy
                    ? '#b45309'
                    : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{obs.date}</span>
                {isCloudy && <span style={{ fontSize: '10px' }}>☁</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

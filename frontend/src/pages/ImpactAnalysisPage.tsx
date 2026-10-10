import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Building,
  Navigation,
  TreePine,
  Factory,
  Home,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { MaharashtraDam } from '../data/dams';
import { getScenarioForDam } from '../data/simulations';
import { MaharashtraMap } from '../components/MaharashtraMap';

interface ImpactAnalysisPageProps {
  selectedDam: MaharashtraDam;
  onNavigate: (page: string) => void;
}

export const ImpactAnalysisPage: React.FC<ImpactAnalysisPageProps> = ({
  selectedDam,
  onNavigate,
}) => {
  const [layers, setLayers] = useState({
    floodExtent: true,
    settlements: true,
    roads: true,
    buildings: true,
    agriculture: true,
    criticalInfrastructure: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scenario = getScenarioForDam(selectedDam.id);
  const currentStep = scenario.timesteps[scenario.timesteps.length - 1]; // 24 hr peak

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* Title */}
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
            Impact Analysis
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            View potentially affected downstream areas and infrastructure from {selectedDam.name}
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="btn-primary"
          style={{ fontSize: '13px', padding: '8px 14px' }}
        >
          Generate Official Monitoring Report →
        </button>
      </div>

      {/* Main Grid: Map with Layer Checklist & Right Impact Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1fr', gap: '20px', minHeight: '520px' }}>
        {/* Left Map View with Floating Layer Controls */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
          {/* Map Layer Toggle Box matching Reference Screen 6 */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              minWidth: '175px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Map Layers
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
              {[
                { key: 'floodExtent', label: 'Flood Extent' },
                { key: 'settlements', label: 'Settlements' },
                { key: 'roads', label: 'Roads' },
                { key: 'buildings', label: 'Buildings' },
                { key: 'agriculture', label: 'Agriculture' },
                { key: 'criticalInfrastructure', label: 'Critical Infrastructure' },
              ].map(({ key, label }) => {
                const checked = layers[key as keyof typeof layers];
                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: checked ? '#0f172a' : '#64748b',
                      fontWeight: checked ? 500 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLayer(key as keyof typeof layers)}
                      style={{ accentColor: '#0284c7', cursor: 'pointer' }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          <MaharashtraMap
            selectedDam={selectedDam}
            floodPolygon={currentStep.floodPolygon}
            simulationActive={true}
            showLayers={layers}
            zoomLevel={9}
            height="100%"
          />
        </div>

        {/* Right Impact Metrics Card matching Reference Screen 6 */}
        <div
          className="card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
              Affected Areas (Estimate)
            </h3>

            {/* Impact Metric Rows matching Reference Image 2 Screen 6 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Home size={18} color="#dc2626" />
                  <span style={{ color: '#475569' }}>Villages / Settlements</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#dc2626' }}>
                  {currentStep.affectedSettlements}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Navigation size={18} color="#0284c7" />
                  <span style={{ color: '#475569' }}>Roads (km)</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0284c7' }}>
                  {currentStep.affectedRoadsKm}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Building size={18} color="#ea580c" />
                  <span style={{ color: '#475569' }}>Buildings</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ea580c' }}>
                  {currentStep.affectedBuildings}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <TreePine size={18} color="#16a34a" />
                  <span style={{ color: '#475569' }}>Agricultural Area (km²)</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a' }}>
                  {currentStep.affectedAgriSqKm}
                </span>
              </div>
            </div>

            {/* Estimated Flood Arrival Timeline */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Estimated Flood Arrival
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedDam.downstreamSettlements.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{st.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge badge-${st.riskLevel.toLowerCase()}`} style={{ fontSize: '10.5px' }}>
                        {st.riskLevel}
                      </span>
                      <span style={{ color: '#64748b', fontWeight: 500 }}>
                        {st.arrivalTimeHours} hrs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prototype Disclosure Note */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#fffbeb',
              borderRadius: '6px',
              border: '1px solid #fef3c7',
              fontSize: '11px',
              color: '#92400e',
            }}
          >
            <b>Prototype Estimate:</b> Inundation metrics are model-derived from 30m DEM elevation channels. Evacuation corridors are coordinated through Pune District Collectorate &amp; DDMA.
          </div>
        </div>
      </div>
    </div>
  );
};

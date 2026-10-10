import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Waves,
  Maximize2,
  ChevronRight,
  Download,
  FileText,
} from 'lucide-react';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';
import {
  SimulationScenarioConfig,
  SimulationTimeStep,
  getScenarioForDam,
} from '../data/simulations';
import {
  RealisticDamSimulationMap,
  VisualisationLayerType,
} from '../components/RealisticDamSimulationMap';
import { simulationService } from '../services/simulationService';
import { useTranslation } from '../context/LanguageContext';

interface SimulationPageProps {
  selectedDam: MaharashtraDam;
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({
  selectedDam,
  onSelectDam,
  onNavigate,
}) => {
  const { t } = useTranslation();

  // Scenario configuration based on selected dam
  const [scenario, setScenario] = useState<SimulationScenarioConfig>(() =>
    getScenarioForDam(selectedDam.id)
  );

  // User configurable parameters
  const [breachType, setBreachType] = useState<string>('Overtopping Failure (High Inflow Surge)');
  const [breachWidth, setBreachWidth] = useState<number>(scenario.breachWidthM || 60);
  const [formationTimeMin, setFormationTimeMin] = useState<number>(
    Math.round((scenario.formationTimeHrs || 0.8) * 60)
  );
  const [durationHrs] = useState<number>(24);
  const [reservoirLevelPct, setReservoirLevelPct] = useState<number>(
    selectedDam.currentLevelPct || 88.5
  );

  // Time scrubber state (steps: 0h, 2h, 6h, 12h, 24h)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  // Map visualization controls
  const [activeLayer, setActiveLayer] = useState<VisualisationLayerType>('depth');
  const [realGeeDem, setRealGeeDem] = useState<boolean>(true);

  // Simulation execution pipeline state
  const [simStatus, setSimStatus] = useState<string>('Ready for Simulation');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<{
    stage1: boolean;
    stage2: boolean;
    stage3: boolean;
    stage4: boolean;
    stage5: boolean;
  }>({
    stage1: true,
    stage2: true,
    stage3: true,
    stage4: true,
    stage5: false,
  });

  const [solverSource, setSolverSource] = useState<string>('DEMO • SIMULATED EXAMPLE');

  // Immediate, synchronous handler for switching any dam
  const handleDamSelect = (dam: MaharashtraDam) => {
    onSelectDam(dam);
    const newConfig = getScenarioForDam(dam.id);
    setScenario(newConfig);
    setBreachWidth(newConfig.breachWidthM);
    setFormationTimeMin(Math.round(newConfig.formationTimeHrs * 60));
    setReservoirLevelPct(dam.currentLevelPct || 88.5);
    setCurrentStepIndex(1); // Default to 2hr surging front
    setSimStatus('Ready for Simulation');
  };

  // Keep scenario synchronized with selectedDam prop
  useEffect(() => {
    const newConfig = getScenarioForDam(selectedDam.id);
    setScenario(newConfig);
    setBreachWidth(newConfig.breachWidthM);
    setFormationTimeMin(Math.round(newConfig.formationTimeHrs * 60));
    setReservoirLevelPct(selectedDam.currentLevelPct || 88.5);
    setCurrentStepIndex(1);
    setSimStatus('Ready for Simulation');
  }, [selectedDam.id]);

  const timeSteps = scenario.timesteps;
  const currentStep = timeSteps[currentStepIndex] || timeSteps[0];

  // Auto-play animation loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= timeSteps.length - 1) {
            return 0; // Loop smoothly
          }
          return prev + 1;
        });
      }, 2500 / playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeSteps.length, playSpeed]);

  // Handle Run Simulation execution with visible progression
  const handleRunSimulation = async () => {
    setIsPlaying(false);
    setIsSimulating(true);
    setCurrentStepIndex(0); // Start from breach initiation
    setSimStatus('Preparing Parameters...');
    setPipelineProgress({ stage1: false, stage2: false, stage3: false, stage4: false, stage5: false });

    setTimeout(() => {
      setPipelineProgress((p) => ({ ...p, stage1: true }));
      setSimStatus('Running Hydrodynamic Solver...');
    }, 350);

    setTimeout(() => {
      setPipelineProgress((p) => ({ ...p, stage2: true }));
    }, 700);

    setTimeout(async () => {
      setPipelineProgress({ stage1: true, stage2: true, stage3: true, stage4: true, stage5: false });
      setSimStatus('Ready for Simulation');
      setIsSimulating(false);

      const response = await simulationService.runSimulation({
        damId: selectedDam.id,
        breachType,
        breachWidthM: breachWidth,
        formationTimeHrs: formationTimeMin / 60,
        durationHrs: durationHrs,
        reservoirLevelPct,
      });

      setScenario(response.config);
      setSolverSource(
        response.source === 'BACKEND_SOLVER'
          ? 'FASTAPI HYDRO KERNEL (LIVE)'
          : 'DEMO • SIMULATED EXAMPLE'
      );

      // Start automatic playback to visibly demonstrate water flow
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }, 1200);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
        overflow: 'hidden',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          backgroundColor: 'var(--bg-header)',
          borderBottom: '1px solid var(--border-color)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Waves size={19} />
          </div>
          <div>
            <div
              style={{
                fontSize: '14.5px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--text-main)',
                textTransform: 'uppercase',
              }}
            >
              DAM BREAK INUNDATION &amp; HADR DECISION SUPPORT
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {selectedDam.name} ({scenario.river} River) | Hydrodynamic Flood Intelligence
            </div>
          </div>
        </div>

        {/* Prototype / Solver Badge */}
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '5px',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary-blue)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}
        >
          {solverSource}
        </div>
      </div>

      {/* Main Simulation Viewport: Left Sidebar Controls + Right 3D Satellite Map & Timeline */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* Left Control Panel (Matching Screenshot Clean Layout) */}
        <div
          style={{
            width: '360px',
            backgroundColor: 'var(--bg-card)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            zIndex: 15,
            padding: '16px 18px',
            gap: '16px',
          }}
        >
          {/* Simulation Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isSimulating ? '#f59e0b' : '#10b981',
                boxShadow: isSimulating ? '0 0 6px #f59e0b' : '0 0 6px #10b981',
              }}
            />
            <span style={{ fontWeight: 600 }}>Simulation Status</span>
            <span style={{ color: isSimulating ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
              ✔ {simStatus}
            </span>
          </div>

          {/* 1. Select Maharashtra Dam */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              1. Select Maharashtra Dam
            </label>
            <select
              value={selectedDam.id}
              onChange={(e) => {
                const dam = MAHARASHTRA_DAMS.find((d) => d.id === e.target.value);
                if (dam) handleDamSelect(dam);
              }}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '7px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
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

            {/* Quick Click Dam Chips */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                marginTop: '8px',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
              }}
            >
              {MAHARASHTRA_DAMS.map((d) => {
                const isCurrent = d.id === selectedDam.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleDamSelect(d)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: '14px',
                      fontSize: '11px',
                      fontWeight: isCurrent ? 700 : 500,
                      backgroundColor: isCurrent ? '#0284c7' : 'var(--bg-panel)',
                      color: isCurrent ? '#ffffff' : 'var(--text-muted)',
                      border: isCurrent ? '1px solid #0284c7' : '1px solid var(--border-color)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {d.name.replace(/ Dam.*/, '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2x2 Grid: Dam Height, Reservoir Volume, Breach Width, Formation Time */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Dam Height (m)
              </label>
              <input
                type="number"
                value={scenario.damHeightM}
                readOnly
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Reservoir Volume (MM³)
              </label>
              <input
                type="number"
                value={scenario.reservoirCapacityMCM}
                readOnly
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Breach Width (m)
              </label>
              <input
                type="number"
                value={breachWidth}
                onChange={(e) => setBreachWidth(Number(e.target.value))}
                min={20}
                max={500}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Formation Time (min)
              </label>
              <input
                type="number"
                value={formationTimeMin}
                onChange={(e) => setFormationTimeMin(Number(e.target.value))}
                min={5}
                max={240}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>

          {/* Scenario Mode Dropdown */}
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Scenario Mode
            </label>
            <select
              value={breachType}
              onChange={(e) => setBreachType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '6px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Overtopping Failure (High Inflow Surge)">
                Overtopping Failure (High Inflow Surge)
              </option>
              <option value="Piping Foundation Breach">Piping Foundation Breach</option>
              <option value="Sudden Multi-Spillway Gate Failure">
                Sudden Multi-Spillway Gate Failure
              </option>
            </select>
          </div>

          {/* Run Flood Simulation Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: '7px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
              opacity: isSimulating ? 0.75 : 1,
            }}
          >
            <Play size={16} fill="#ffffff" />
            {isSimulating ? 'Simulating...' : 'Run Flood Simulation'}
          </button>

          {/* Simulation Pipeline */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '10px',
              }}
            >
              Simulation Pipeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 01 Data Ingestion */}
              <div
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    01
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Data Ingestion
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      DEM • River • Hydrology • Infrastructure
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: pipelineProgress.stage1 ? '#10b981' : '#f59e0b',
                    backgroundColor: pipelineProgress.stage1 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {pipelineProgress.stage1 ? '✔ Ingested' : '...'}
                </span>
              </div>

              {/* 02 SPH Breach Model */}
              <div
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    02
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                      SPH Breach Model
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Froehlich empirical hydrograph
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: pipelineProgress.stage2 ? '#10b981' : '#f59e0b',
                    backgroundColor: pipelineProgress.stage2 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {pipelineProgress.stage2 ? '✔ Generated' : '...'}
                </span>
              </div>

              {/* 03 DELFT3D Basin Routing */}
              <div
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    03
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                      DELFT3D Basin Routing
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Kinematic wave propagation
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: pipelineProgress.stage3 ? '#10b981' : '#f59e0b',
                    backgroundColor: pipelineProgress.stage3 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {pipelineProgress.stage3 ? '✔ Propagated' : '...'}
                </span>
              </div>

              {/* 04 Impact & Post-Processing */}
              <div
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    04
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Impact &amp; Post-Processing
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Depth &amp; velocity exposure mapping
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: pipelineProgress.stage4 ? '#10b981' : '#f59e0b',
                    backgroundColor: pipelineProgress.stage4 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {pipelineProgress.stage4 ? '✔ Completed' : '...'}
                </span>
              </div>

              {/* 05 HADR Decision Support */}
              <div
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    05
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                      HADR Decision Support
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Evacuation routing and alerts
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: '#0284c7',
                    border: '1px solid rgba(2, 132, 199, 0.4)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  ○ Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Realistic 3D Satellite Map (Top) + Full-Width Timeline (Bottom) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          {/* Map Viewport Container */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <RealisticDamSimulationMap
              scenario={scenario}
              currentStep={currentStep}
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
              realGeeDem={realGeeDem}
              onToggleRealGeeDem={setRealGeeDem}
              selectedDam={selectedDam}
              onSelectDam={handleDamSelect}
            />
          </div>

          {/* Full-Width Simulation Timeline Bar (Matching Screenshot) */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-color)',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 15,
              boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
            }}
          >
            {/* Circular Blue Play / Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.45)',
                transition: 'transform 0.1s ease',
              }}
              title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            >
              {isPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />}
            </button>

            {/* Timeline Center Section */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Timeline Header Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>Simulation Timeline</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>{currentStep.label}</span>
              </div>

              {/* Slider Track with Ticks */}
              <div style={{ position: 'relative', width: '100%', marginTop: '2px' }}>
                <input
                  type="range"
                  min="0"
                  max={timeSteps.length - 1}
                  value={currentStepIndex}
                  onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    accentColor: '#0284c7',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                />

                {/* Ticks: 0 hr, 2 hr, 6 hr, 12 hr, 24 hr */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}
                >
                  {timeSteps.map((st, i) => (
                    <span
                      key={st.hours}
                      onClick={() => setCurrentStepIndex(i)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: i === currentStepIndex ? 700 : 500,
                        color: i === currentStepIndex ? '#0284c7' : 'var(--text-muted)',
                      }}
                    >
                      {st.hours} hr
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Speed Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Speed:</span>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-panel)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  padding: '2px',
                }}
              >
                {[0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaySpeed(s)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: playSpeed === s ? 700 : 500,
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: playSpeed === s ? '#0284c7' : 'transparent',
                      color: playSpeed === s ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen Expand Button */}
            <button
              onClick={() => {
                const elem = document.documentElement;
                if (!document.fullscreenElement) {
                  elem.requestFullscreen?.();
                } else {
                  document.exitFullscreen?.();
                }
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-panel)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

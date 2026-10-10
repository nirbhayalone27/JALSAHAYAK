import React, { useState, useEffect } from 'react';
import {
  Clock,
  Layers,
  AlertTriangle,
  Users,
  Home as HomeIcon,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { MaharashtraMap } from '../components/MaharashtraMap';
import { WaterLevelChart, InflowOutflowChart } from '../components/Charts';
import { MAHARASHTRA_DAMS, MaharashtraDam, getDamById } from '../data/dams';
import { UPCOMING_EVENTS } from '../data/events';
import { useTranslation } from '../context/LanguageContext';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  selectedDam: MaharashtraDam;
  onSelectDam: (dam: MaharashtraDam) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  selectedDam,
  onSelectDam,
}) => {
  const { t, language } = useTranslation();
  // Real-time dynamic system clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format: DD MMM YYYY, HH:MM AM/PM (e.g. 08 Oct 2026, 11:42 PM)
  const formatDateTime = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  // Lookup active dam from shared data layer
  const currentDam = getDamById(selectedDam.id) || selectedDam;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 28px' }}>
      {/* 3. Dashboard Title Hierarchy & 4. Dynamic Real-time Date and Time */}
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
              color: 'var(--text-main)',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            {t('dashboard.title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Dynamic Clock with Live Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-card)',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#16a34a',
              fontWeight: 600,
              fontSize: '11.5px',
              padding: '2px 7px',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              borderRadius: '12px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
              }}
            />
            {t('dashboard.live')}
          </span>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {formatDateTime(currentTime)}
          </span>
        </div>
      </div>

      {/* 13. Top KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          value="10"
          label={t('dashboard.kpi.monitored')}
          icon={Layers}
          tint="blue"
        />
        <MetricCard
          value="2"
          label={t('dashboard.kpi.high_risk')}
          icon={AlertTriangle}
          tint="red"
        />
        <MetricCard
          value="480K"
          label={t('dashboard.kpi.population_risk')}
          icon={Users}
          tint="orange"
        />
        <MetricCard
          value="145 km²"
          label={t('dashboard.kpi.potential_inundation')}
          icon={HomeIcon}
          tint="purple"
        />
      </div>

      {/* Main Grid: Maharashtra Map (Left), Selected Dam Card (Middle), Alerts & Events (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.45fr 0.85fr 0.95fr',
          gap: '16px',
          minHeight: '410px',
        }}
      >
        {/* 6. Main Maharashtra Map Card with 5. Map Controls (Map | Satellite | Terrain) */}
        <div
          className="card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px',
            padding: 0,
          }}
        >
          <MaharashtraMap
            selectedDam={currentDam}
            onSelectDam={onSelectDam}
            zoomLevel={8}
            height="100%"
          />
        </div>

        {/* 7 & 8. Selected Dam Card (Fully Dynamic Dam Details & Dynamic Image) */}
        <div
          className="card"
          style={{
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('dashboard.selected_dam')}
              </span>
              <span
                className={`badge badge-${currentDam.riskLevel.toLowerCase()}`}
                style={{ fontSize: '10.5px' }}
              >
                {currentDam.riskLevel === 'High' ? t('dashboard.high_risk') : currentDam.riskLevel === 'Medium' ? t('dashboard.medium_risk') : t('dashboard.normal_risk')}
              </span>
            </div>

            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              {currentDam.name}
            </div>

            {/* Dropdown Dam Selector for quick selection */}
            <select
              value={currentDam.id}
              onChange={(e) => {
                const dam = getDamById(e.target.value);
                if (dam) onSelectDam(dam);
              }}
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-input)',
                cursor: 'pointer',
                marginBottom: '10px',
                outline: 'none',
              }}
            >
              {MAHARASHTRA_DAMS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.district})
                </option>
              ))}
            </select>

            {/* 8. Dynamic Dam Image per selected dam */}
            <div
              style={{
                width: '100%',
                height: '135px',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-panel)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={currentDam.imageUrl}
                alt={currentDam.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to structured SVG placeholder if image path fails
                  e.currentTarget.src = `/assets/dams/${currentDam.id}.svg`;
                }}
              />
            </div>

            {/* 7. Dam Metadata: State, District, River, Type, Height, Year */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'राज्य' : 'State'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentDam.state}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'ज़िला' : 'District'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentDam.district}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'नदी' : 'River'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentDam.river}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'प्रकार' : 'Type'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', maxWidth: '140px' }}>
                  {currentDam.damType}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'ऊंचाई' : 'Height'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentDam.heightM} m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? 'निर्माण वर्ष' : 'Year'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentDam.yearCompleted}</span>
              </div>
            </div>
          </div>

          {/* Run Simulation Action Button */}
          <button
            onClick={() => onNavigate('simulation')}
            className="btn-primary"
            style={{ width: '100%', padding: '9px', fontSize: '13px' }}
          >
            {language === 'hi' ? 'सिमुलेशन चलाएं →' : 'Run Simulation →'}
          </button>
        </div>

        {/* Right Column: Recent Alerts & Upcoming Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recent Alerts Card */}
          <div className="card" style={{ padding: '14px 16px', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                {language === 'hi' ? 'हालिया अलर्ट्स' : 'Recent Alerts'}
              </span>
              <button
                onClick={() => onNavigate('alerts')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#0284c7',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                View All &gt;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* High Risk Alert */}
              <div
                onClick={() => onNavigate('alerts')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '7px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div style={{ color: '#dc2626', marginTop: '1px' }}>
                  <AlertTriangle size={15} fill="#dc2626" color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>High Risk</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>2 hours ago</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#1e293b', fontWeight: 500, marginTop: '2px' }}>
                    Khadakwasla – Water level threshold alert
                  </div>
                </div>
              </div>

              {/* Medium Risk Alert */}
              <div
                onClick={() => onNavigate('alerts')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '7px',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #ffedd5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div style={{ color: '#ea580c', marginTop: '1px' }}>
                  <AlertTriangle size={15} fill="#ea580c" color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c' }}>Medium Risk</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>5 hours ago</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#1e293b', fontWeight: 500, marginTop: '2px' }}>
                    Panshet – Catchment runoff elevated
                  </div>
                </div>
              </div>

              {/* Low Risk Alert */}
              <div
                onClick={() => onNavigate('alerts')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '7px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div style={{ color: '#d97706', marginTop: '1px' }}>
                  <AlertTriangle size={15} fill="#d97706" color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706' }}>Medium Risk</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>8 hours ago</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#1e293b', fontWeight: 500, marginTop: '2px' }}>
                    Chaskaman – Inflow surge monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="card" style={{ padding: '14px 16px', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                {language === 'hi' ? 'आगामी घटनाएं' : 'Upcoming Events'}
              </span>
              <button
                onClick={() => onNavigate('events')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--primary-blue)',
                  cursor: 'pointer',
                }}
              >
                {language === 'hi' ? 'सभी देखें >' : 'View All >'}
              </button>
            </div>

            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-light)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 0', fontWeight: 600 }}>{language === 'hi' ? 'दिनांक' : 'Date'}</th>
                  <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 600 }}>{language === 'hi' ? 'घटना' : 'Event'}</th>
                  <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600 }}>{language === 'hi' ? 'स्थान' : 'Location'}</th>
                </tr>
              </thead>
              <tbody>
                {UPCOMING_EVENTS.map((evt, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>{evt.date}</td>
                    <td style={{ padding: '6px 6px', color: 'var(--text-main)', fontWeight: 500 }}>{evt.event}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--primary-blue)', fontWeight: 600 }}>
                      {evt.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Charts & Risk Status Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.2fr 0.95fr',
          gap: '16px',
        }}
      >
        {/* Water Level Chart Card */}
        <div className="card" style={{ padding: '16px 18px', height: '210px' }}>
          <WaterLevelChart />
        </div>

        {/* Inflow / Outflow Chart Card */}
        <div className="card" style={{ padding: '16px 18px', height: '210px' }}>
          <InflowOutflowChart />
        </div>

        {/* Risk Status (Nearby Areas) Table Card */}
        <div className="card" style={{ padding: '16px 18px', height: '210px', overflowY: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              {language === 'hi' ? 'जोखिम स्थिति (समीपवर्ती क्षेत्र)' : 'Risk Status (Nearby Areas)'}
            </span>
            <button
              onClick={() => onNavigate('impact')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--primary-blue)',
                cursor: 'pointer',
              }}
            >
              {language === 'hi' ? 'सभी देखें >' : 'View All >'}
            </button>
          </div>

          <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-light)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600 }}>{language === 'hi' ? 'क्षेत्र' : 'Area'}</th>
                <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600 }}>{language === 'hi' ? 'जोखिम स्तर' : 'Risk Level'}</th>
                <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 600 }}>{language === 'hi' ? 'अनुमानित आगमन' : 'Est. Arrival'}</th>
              </tr>
            </thead>
            <tbody>
              {currentDam.downstreamSettlements.map((st, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: 'var(--text-main)' }}>{st.name}</td>
                  <td style={{ padding: '8px 0', textAlign: 'center' }}>
                    <span className={`badge badge-${st.riskLevel.toLowerCase()}`} style={{ fontSize: '10.5px' }}>
                      {st.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-muted)' }}>
                    {st.arrivalTimeHours} hrs
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

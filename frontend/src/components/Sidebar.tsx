import React from 'react';
import {
  Home,
  Activity,
  Radio,
  Layers,
  ShieldAlert,
  FileText,
  Database,
  Bell,
  Settings,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: Home },
    { id: 'dams', label: t('nav.dams', 'Dams'), icon: Database },
    { id: 'monitoring', label: t('nav.monitoring', 'Live Monitoring'), icon: Radio },
    { id: 'satellite', label: t('nav.satellite', 'Satellite'), icon: Layers },
    { id: 'simulation', label: t('nav.simulation', 'Simulation'), icon: Activity },
    { id: 'impact', label: t('nav.impact', 'Impact Analysis'), icon: ShieldAlert },
    { id: 'reports', label: t('nav.reports', 'Reports'), icon: FileText },
    { id: 'alerts', label: t('nav.alerts', 'Alerts'), icon: Bell },
    { id: 'settings', label: t('nav.settings', 'Settings'), icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '236px',
        minWidth: '236px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        padding: '12px 12px 16px 12px',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div>
        {/* 1. Indian Tricolour Thin Horizontal Line: ORANGE | WHITE | GREEN */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            width: '100%',
            height: '2.5px',
            marginBottom: '10px',
          }}
        >
          <div style={{ flex: 1, height: '100%', backgroundColor: '#FF9933', borderRadius: '1px' }} />
          <div
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '0.5px solid #cbd5e1',
              boxSizing: 'border-box',
              borderRadius: '1px',
            }}
          />
          <div style={{ flex: 1, height: '100%', backgroundColor: '#138808', borderRadius: '1px' }} />
        </div>

        {/* 2. Official Government of India Emblem & Organisation Block */}
        <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
          <img
            src="/assets/state-emblem.svg"
            alt="Government of India Emblem"
            style={{
              height: '42px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 6px auto',
              objectFit: 'contain',
            }}
          />
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '0.02em',
              lineHeight: 1.25,
            }}
          >
            {t('brand.ministry', 'Government of India')}
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              lineHeight: 1.3,
              marginTop: '1px',
            }}
          >
            {t('brand.org', 'National Technical Research Organisation (NTRO)')}
          </div>
        </div>

        {/* Subtle Separator */}
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0 4px 12px 4px' }} />

        {/* 3. JalSahayak Wordmark & Subtitle */}
        <div
          onClick={() => onNavigate('dashboard')}
          style={{
            padding: '0 6px 14px 6px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            JalSahayak
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginTop: '2px',
              lineHeight: 1.3,
            }}
          >
            {t('brand.subtitle', 'Autonomous Dam-Break Intelligence & Early Warning')}
          </div>
        </div>

        {/* 4. Primary Vertical Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-blue)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.12s ease, color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-panel)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={17} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Block */}
      <div
        style={{
          padding: '10px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#16a34a',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-main)' }}>
            System Operational
          </span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
          All 10 Pune telemetry nodes active
        </div>
      </div>
    </aside>
  );
};

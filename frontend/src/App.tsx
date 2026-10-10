import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { DamsPage } from './pages/DamsPage';
import { DamDetailPage } from './pages/DamDetailPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { SatellitePage } from './pages/SatellitePage';
import { SimulationPage } from './pages/SimulationPage';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { PastEventsPage } from './pages/PastEventsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MAHARASHTRA_DAMS, MaharashtraDam } from './data/dams';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedDam, setSelectedDam] = useState<MaharashtraDam>(MAHARASHTRA_DAMS[0]); // Default: Khadakwasla Dam
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDam = (dam: MaharashtraDam) => {
    setSelectedDam(dam);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}

      {/* Main Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Sticky Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSelectDam={handleSelectDam}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Page Router */}
        <main style={{ flex: 1, paddingBottom: currentPage === 'simulation' ? '0' : '32px' }}>
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              selectedDam={selectedDam}
              onSelectDam={handleSelectDam}
            />
          )}

          {currentPage === 'dams' && (
            <DamsPage
              onSelectDam={handleSelectDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'dam-detail' && (
            <DamDetailPage
              dam={selectedDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'monitoring' && (
            <LiveMonitoringPage
              onNavigate={handleNavigate}
              onSelectDam={handleSelectDam}
            />
          )}

          {currentPage === 'satellite' && (
            <SatellitePage
              selectedDam={selectedDam}
              onSelectDam={handleSelectDam}
            />
          )}

          {currentPage === 'simulation' && (
            <SimulationPage
              selectedDam={selectedDam}
              onSelectDam={handleSelectDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'impact' && (
            <ImpactAnalysisPage
              selectedDam={selectedDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'events' && (
            <PastEventsPage
              onSelectDam={handleSelectDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsPage
              onSelectDam={handleSelectDam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

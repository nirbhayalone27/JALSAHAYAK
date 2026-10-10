import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onSelectDam: (dam: MaharashtraDam) => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onSelectDam,
  onNavigate,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MaharashtraDam[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = MAHARASHTRA_DAMS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.river.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q)
    );
    setSearchResults(matches);
    setShowResults(true);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (dam: MaharashtraDam) => {
    onSelectDam(dam);
    onNavigate('dam-detail');
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header
      style={{
        height: '60px',
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Left: Mobile Toggle & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '640px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--text-light)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
              placeholder={t('header.search_placeholder', 'Search dam, river, district or location...')}
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                outline: 'none',
                transition: 'border-color 0.15s, background-color 0.2s',
              }}
            />
          </div>

          {/* Interactive Search Dropdown Results */}
          {showResults && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-hover)',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 1100,
              }}
            >
              {searchResults.length > 0 ? (
                <div>
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: 'var(--bg-panel)',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                  >
                    Maharashtra Dams ({searchResults.length})
                  </div>
                  {searchResults.map((dam) => (
                    <div
                      key={dam.id}
                      onClick={() => handleSelectResult(dam)}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-panel)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {dam.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {dam.river} River • {dam.district} District
                        </div>
                      </div>
                      <span
                        className={`badge badge-${dam.riskLevel.toLowerCase()}`}
                        style={{ fontSize: '11px' }}
                      >
                        {dam.riskLevel} Risk
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No Maharashtra dam matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: EN|हिन्दी Selector, Theme Toggle, Notification & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Language Selector: EN | हिन्दी */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2px',
          }}
        >
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: language === 'en' ? 'var(--primary-blue)' : 'transparent',
              color: language === 'en' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: language === 'hi' ? 'var(--primary-blue)' : 'transparent',
              color: language === 'hi' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            हिन्दी
          </button>
        </div>

        {/* Light / Dark Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-panel)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title={isDark ? t('header.theme_light', 'Switch to Light Mode') : t('header.theme_dark', 'Switch to Dark Mode')}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#0284c7" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate('alerts')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.15s',
          }}
          title={t('header.alerts_title', 'Active Alerts')}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-header)',
            }}
          >
            1
          </span>
        </button>

        {/* User Pill */}
        <div
          onClick={() => onNavigate('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '20px',
            transition: 'background 0.15s',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-blue)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12.5px',
              fontWeight: 700,
            }}
          >
            N
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
            Nirbhay
          </span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
};

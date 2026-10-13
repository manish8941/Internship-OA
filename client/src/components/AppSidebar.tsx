import React, { useState } from 'react';
import {
  Compass,
  Users,
  HeartHandshake,
  Award,
  Database,
  PlusCircle,
  SlidersHorizontal,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface AppSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenIngest: () => void;
  onOpenDemo: () => void;
  llmProvider: string;
  participantsCount?: number;
}

/**
 * AppSidebar — Elegant Navigation Rail & Mobile Header
 * Combines Aniwall spatial composition and Arca editorial styling.
 */
export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenIngest,
  onOpenDemo,
  llmProvider,
  participantsCount = 25,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'directory', label: 'People', icon: Users },
    { id: 'timeline', label: 'Dating Sessions', icon: HeartHandshake },
    { id: 'rankings', label: 'Compatibility Rankings', icon: Award },
    { id: 'audit', label: 'Data Sources / Audit', icon: Database },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation Rail */}
      <aside className="app-sidebar">
        {/* Wordmark Header */}
        <div className="sidebar-brand">
          <div className="brand-symbol">
            <div className="brand-symbol-dot" />
          </div>
          <div className="brand-text">
            <span className="brand-name">AuraMatch</span>
            <span className="brand-tag">Agentic AI Chemistry</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-item-icon">
                  <Icon size={17} />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Action Trigger Buttons */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onOpenIngest} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <PlusCircle size={15} /> Add Participant
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onOpenDemo} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <SlidersHorizontal size={14} /> Demo Controls
            </button>
          </div>
        </nav>

        {/* Footer & Understated System Status Area */}
        <div className="sidebar-footer">
          <div className="demo-indicator">
            <span className="demo-dot" />
            <span>Demo: {participantsCount} Demo Profiles</span>
          </div>

          <div className="system-status">
            <div>Engine: {llmProvider.includes('Ollama') ? 'Ollama Local' : 'Offline Synthesis'}</div>
            <div>Storage: SQLite Persisted</div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-symbol" style={{ width: '28px', height: '28px' }}>
            <div className="brand-symbol-dot" style={{ width: '8px', height: '8px' }} />
          </div>
          <span className="brand-name" style={{ fontSize: '1.2rem' }}>
            AuraMatch
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-primary btn-sm" onClick={onOpenIngest}>
            <PlusCircle size={13} /> Add
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ padding: '6px' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Tray */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '60px 0 0 0',
            background: 'rgba(247, 245, 240, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 90,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ padding: '14px 18px', fontSize: '1rem' }}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
            <button className="btn btn-secondary" onClick={() => { onOpenDemo(); setIsMobileMenuOpen(false); }} style={{ width: '100%' }}>
              <SlidersHorizontal size={15} /> Demo Controls & Seeder
            </button>
          </div>
        </div>
      )}
    </>
  );
};

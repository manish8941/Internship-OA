import React from 'react';
import {
  Users,
  HeartHandshake,
  Award,
  ShieldCheck,
  UserPlus,
  Database,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenIngest: () => void;
  onOpenDemo: () => void;
  llmProvider: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenIngest,
  onOpenDemo,
  llmProvider,
}) => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="brand-logo" onClick={() => onTabChange('directory')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>
            AuraMatch <span className="gradient-text">AI</span>
          </span>
        </div>

        <ul className="nav-links">
          <li>
            <button
              id="nav-directory-btn"
              className={`nav-item-btn ${currentTab === 'directory' ? 'active' : ''}`}
              onClick={() => onTabChange('directory')}
            >
              <Users size={16} />
              Directory
            </button>
          </li>
          <li>
            <button
              id="nav-timeline-btn"
              className={`nav-item-btn ${currentTab === 'timeline' ? 'active' : ''}`}
              onClick={() => onTabChange('timeline')}
            >
              <HeartHandshake size={16} />
              Dating Arena
            </button>
          </li>
          <li>
            <button
              id="nav-rankings-btn"
              className={`nav-item-btn ${currentTab === 'rankings' ? 'active' : ''}`}
              onClick={() => onTabChange('rankings')}
            >
              <Award size={16} />
              Rankings
            </button>
          </li>
          <li>
            <button
              id="nav-audit-btn"
              className={`nav-item-btn ${currentTab === 'audit' ? 'active' : ''}`}
              onClick={() => onTabChange('audit')}
            >
              <ShieldCheck size={16} />
              Extraction Status
            </button>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="badge badge-emerald" title={llmProvider} style={{ cursor: 'help' }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '0.72rem' }}>Offline Engine Ready</span>
          </div>

          <button id="add-participant-nav-btn" className="btn btn-primary btn-sm" onClick={onOpenIngest}>
            <UserPlus size={15} />
            Add Participant
          </button>

          <button id="demo-controls-nav-btn" className="btn btn-secondary btn-sm" onClick={onOpenDemo}>
            <Database size={15} />
            Demo Data
          </button>
        </div>
      </div>
    </nav>
  );
};

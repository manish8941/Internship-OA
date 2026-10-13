import React, { useState } from 'react';
import { seedDemo, simulateAllDates } from '../services/api.js';
import { X, Database, Sparkles, RefreshCw, Trash2, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface DemoControlsModalProps {
  onClose: () => void;
  onDataChanged: () => void;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  onClose,
  onDataChanged,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSeed = async (forceClear: boolean) => {
    try {
      setLoading(true);
      setStatusMessage('Seeding 25 verified public figures and running initial dating simulations...');
      await seedDemo(forceClear);
      setLoading(false);
      setStatusMessage('Successfully populated demo dataset in SQLite!');
      onDataChanged();
    } catch (err: any) {
      setLoading(false);
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const handleSimulateAll = async () => {
    try {
      setLoading(true);
      setStatusMessage('Simulating multi-turn dates across participant pairs...');
      const res = await simulateAllDates();
      setLoading(false);
      setStatusMessage(`Generated ${res.newConversationsCount} new dating conversations and compatibility scores!`);
      onDataChanged();
    } catch (err: any) {
      setLoading(false);
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-wrapper"
        style={{ padding: '36px', maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-lavender">
              <Database size={12} /> SQLite Seeder
            </span>
            <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--color-ink)' }}>
              Demo Controls & Seeder
            </h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '24px' }}>
          Control the local SQLite database. Re-seed 25 verified public figures with dual-source LinkedIn and Instagram profile evidence, or simulate batch dating conversations across participant pairs.
        </p>

        {statusMessage && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 231, 220, 0.45)',
              border: '1px solid rgba(63, 94, 67, 0.2)',
              marginBottom: '20px',
              fontSize: '0.84rem',
              color: 'var(--color-ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {loading ? <span className="demo-dot" /> : <CheckCircle2 size={16} color="#2E7D32" />}
            <span>{statusMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(247, 245, 240, 0.65)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                Re-Seed Demo Dataset (Preserve Data)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
                Populates participants if missing, without wiping previous entries.
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleSeed(false)}
              disabled={loading}
            >
              <RefreshCw size={13} /> Run Seed
            </button>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(247, 245, 240, 0.65)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                Simulate Additional Dates
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
                Batch runs 4-round dates across unsimulated pairs to deepen leaderboard data.
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSimulateAll}
              disabled={loading}
            >
              <HeartHandshake size={13} /> Batch Date
            </button>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(217, 120, 104, 0.08)',
              border: '1px solid rgba(217, 120, 104, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#B24E3F' }}>
                Clear & Fresh Seed (Reset Database)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
                Wipes all conversations & participants, and seeds a clean 25-figure set.
              </div>
            </div>
            <button
              className="btn btn-coral btn-sm"
              onClick={() => handleSeed(true)}
              disabled={loading}
            >
              <Trash2 size={13} /> Reset & Seed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

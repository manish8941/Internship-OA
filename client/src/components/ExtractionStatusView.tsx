import React, { useEffect, useState } from 'react';
import { ExtractionEvidence } from '../types/index.js';
import { fetchEvidences } from '../services/api.js';
import {
  ShieldCheck,
  Linkedin,
  Instagram,
  ExternalLink,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

export const ExtractionStatusView: React.FC = () => {
  const [evidences, setEvidences] = useState<ExtractionEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvidences()
      .then((data) => {
        setEvidences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = evidences.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'linkedin' || filter === 'instagram') return e.source === filter;
    return e.status === filter;
  });

  const total = evidences.length;
  const fixtureCount = evidences.filter((e) => e.status === 'fixture_snapshot').length;
  const liveCount = evidences.filter((e) => e.status === 'live_extracted').length;
  const restrictedCount = evidences.filter((e) => e.status === 'restricted_login_wall').length;
  const avgLatency = total > 0 ? Math.round(evidences.reduce((acc, e) => acc + e.latencyMs, 0) / total) : 0;

  return (
    <div className="extraction-status-view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Editorial View Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> Provenance & Access Audit
          </span>
          <span className="badge badge-sage">Zero Unauthorized Scraping</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="editorial-title" style={{ fontSize: '2.4rem', color: 'var(--color-ink)' }}>
              Data Sources & Evidence Audit
            </h1>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.96rem' }}>
              Full provenance audit log of public profile extractions, platform access boundaries, rate limits, and snapshot fixtures.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'linkedin', 'instagram', 'fixture_snapshot', 'live_extracted', 'restricted_login_wall'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {f.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Guarantee Banner (Aniwall Glass Reference) */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'rgba(220, 231, 220, 0.45)',
          border: '1px solid rgba(63, 94, 67, 0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <ShieldCheck size={26} color="#2E7D32" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
            Platform Access Boundaries & Transparent Provenance
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-ink-subtle)', lineHeight: 1.6 }}>
            Extractors strictly respect platform rate limits, robots policies, and login-walls. When LinkedIn or Instagram return authentication challenges or 999 responses, the system never bypasses authentication, cookies, or CAPTCHAs. All data is transparently logged with real HTTP latency and categorized as either <code>live_extracted</code> or <code>fixture_snapshot</code>.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
            Total Audit Records
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '4px' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
            Dual-source logs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
            Curated Snapshots
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '4px' }}>
            {fixtureCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
            Verified public fixtures
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
            Live Extractions
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '4px' }}>
            {liveCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
            OpenGraph public tags
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
            Authwalls Respected
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '4px' }}>
            {restrictedCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-text)', marginTop: '2px' }}>
            Login walls unbypassed
          </div>
        </div>
      </div>

      {/* Evidences Audit Stream / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-secondary-text)' }}>Loading extraction audit logs from SQLite...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-secondary-text)' }}>No records match the selected filter.</p>
          </div>
        ) : (
          filtered.map((e) => {
            const isLinkedIn = e.source === 'linkedin';
            const isLive = e.status === 'live_extracted';
            const isFixture = e.status === 'fixture_snapshot';

            return (
              <div
                key={e.id}
                className="glass-panel"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isLinkedIn ? (
                      <Linkedin size={16} color="#0077b5" />
                    ) : (
                      <Instagram size={16} color="#e4405f" />
                    )}
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', textTransform: 'capitalize' }}>
                      {e.source} Ingestion
                    </span>
                    <span
                      className={`badge ${
                        isLive ? 'badge-sage' : isFixture ? 'badge-lavender' : 'badge-coral'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {e.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {e.latencyMs}ms
                    </span>
                    <span>•</span>
                    <span>{new Date(e.extractionTimestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--color-ink-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {e.sourceUrl} <ExternalLink size={11} />
                  </a>
                </div>

                {e.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', background: 'rgba(247, 245, 240, 0.6)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Audit Note:</strong> {e.notes}
                  </div>
                )}

                <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-subtle)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{e.rawText.length > 220 ? e.rawText.slice(0, 220) + '...' : e.rawText}"
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

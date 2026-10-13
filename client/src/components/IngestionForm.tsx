import React, { useState } from 'react';
import { User, Linkedin, Instagram, Sparkles, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { ingestParticipant } from '../services/api.js';

interface IngestionFormProps {
  onSuccess: (newParticipantId: string) => void;
  onCancel?: () => void;
}

export const IngestionForm: React.FC<IngestionFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field validation checks
  const isLiValid =
    linkedinUrl.trim().length > 0 &&
    /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(linkedinUrl.trim());
  const isIgValid =
    instagramUrl.trim().length > 0 &&
    /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?instagram\.com\/[a-zA-Z0-9_.-]+/i.test(instagramUrl.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a participant name.');
      return;
    }
    if (!isLiValid) {
      setError('A valid public LinkedIn profile URL is required (e.g., https://www.linkedin.com/in/username).');
      return;
    }
    if (!isIgValid) {
      setError('A valid public Instagram profile URL is required (e.g., https://www.instagram.com/username).');
      return;
    }

    try {
      setLoading(true);
      const res = await ingestParticipant(name, linkedinUrl, instagramUrl);
      setLoading(false);
      onSuccess(res.participant.id);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to ingest participant');
    }
  };

  const handleQuickFill = (nameVal: string, liVal: string, igVal: string) => {
    setName(nameVal);
    setLinkedinUrl(liVal);
    setInstagramUrl(igVal);
    setError(null);
  };

  return (
    <div
      className="modal-content-wrapper"
      style={{
        padding: '36px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-secondary-text)',
          }}
        >
          <X size={20} />
        </button>
      )}

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> Agent Ingestion
          </span>
          <span className="badge badge-sage">Dual-Source Required</span>
        </div>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', color: 'var(--color-ink)' }}>
          Ingest Participant Agent
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem', marginTop: '4px' }}>
          Autonomous synthesis requires both a public LinkedIn profile and a public Instagram profile.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(217, 120, 104, 0.12)',
            border: '1px solid rgba(217, 120, 104, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#B24E3F',
            fontSize: '0.84rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
            Full Name *
          </label>
          <input
            type="text"
            className="input-editorial"
            placeholder="e.g. Satya Nadella, Mira Murati"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
            Public LinkedIn Profile URL *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="url"
              className="input-editorial"
              placeholder="https://www.linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={loading}
              required
            />
            {isLiValid && (
              <CheckCircle2
                size={16}
                color="#2E7D32"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            )}
          </div>
        </div>

        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
            Public Instagram Profile URL *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="url"
              className="input-editorial"
              placeholder="https://www.instagram.com/username"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              disabled={loading}
              required
            />
            {isIgValid && (
              <CheckCircle2
                size={16}
                color="#2E7D32"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            )}
          </div>
        </div>

        {/* Quick Fill Demo Helpers */}
        <div style={{ paddingTop: '8px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
            Quick fill from verified fixtures:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              style={{ border: '1px solid var(--color-border-subtle)' }}
              onClick={() =>
                handleQuickFill(
                  'Andrej Karpathy',
                  'https://www.linkedin.com/in/andrejkarpathy',
                  'https://www.instagram.com/karpathy'
                )
              }
            >
              Andrej Karpathy
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              style={{ border: '1px solid var(--color-border-subtle)' }}
              onClick={() =>
                handleQuickFill(
                  'Fei-Fei Li',
                  'https://www.linkedin.com/in/feifeili',
                  'https://www.instagram.com/drfeifeili'
                )
              }
            >
              Fei-Fei Li
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              style={{ border: '1px solid var(--color-border-subtle)' }}
              onClick={() =>
                handleQuickFill(
                  'Marques Brownlee',
                  'https://www.linkedin.com/in/mkbhd',
                  'https://www.instagram.com/mkbhd'
                )
              }
            >
              Marques Brownlee
            </button>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="demo-dot" /> Synthesizing Agent...
              </>
            ) : (
              <>
                Extract Evidence & Ingest <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import { ParticipantDetailResponse } from '../services/api.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import {
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Instagram,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  HeartHandshake,
  Award,
  Sparkles,
  Clock,
  Activity,
  Layers,
  Info,
} from 'lucide-react';

interface ProfileDetailProps {
  data: ParticipantDetailResponse;
  onBack: () => void;
  onSimulateDate: (participantId: string) => void;
  onViewRankings: (participantId: string) => void;
}

/**
 * ProfileDetail — Premium Profile Dossier
 * Inspired by Arca by ThreeUI (editorial typography, dossier structure)
 * and Aniwall (subtle glass surfaces and layered panels)
 */
export const ProfileDetail: React.FC<ProfileDetailProps> = ({
  data,
  onBack,
  onSimulateDate,
  onViewRankings,
}) => {
  const { participant, profile, evidences, recentConversations = [] } = data;

  const liEv = evidences.find((e) => e.source === 'linkedin');
  const igEv = evidences.find((e) => e.source === 'instagram');

  return (
    <div className="profile-detail-dossier" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Navigation */}
      <div>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ArrowLeft size={15} /> Back to Directory
        </button>
      </div>

      {/* Hero Dossier Header */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <MonogramAvatar name={participant.name} size={84} status="fixture" showStatusDot />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-lavender">Agent Dossier</span>
                <span className="badge badge-neutral">ID: {participant.id}</span>
              </div>
              <h1 className="editorial-title" style={{ fontSize: '2.4rem', color: 'var(--color-ink)' }}>
                {participant.name}
              </h1>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '1rem', marginTop: '4px', maxWidth: '640px' }}>
                {participant.bioHeadline || profile.summary}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onSimulateDate(participant.id)}>
              <HeartHandshake size={16} /> Simulate Date
            </button>
            <button className="btn btn-secondary" onClick={() => onViewRankings(participant.id)}>
              <Award size={16} /> View Rankings
            </button>
          </div>
        </div>

        {/* Source Verification Badges Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <a
            href={participant.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <Linkedin size={14} color="#0077b5" /> LinkedIn Profile <ExternalLink size={11} />
          </a>
          <a
            href={participant.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <Instagram size={14} color="#e4405f" /> Instagram Profile <ExternalLink size={11} />
          </a>

          {/* Separate Retrieval Status Badges */}
          {(() => {
            const liEv = data.evidences.find((e) => e.source === 'linkedin');
            const igEv = data.evidences.find((e) => e.source === 'instagram');

            const renderBadge = (source: string, ev?: typeof liEv) => {
              const st = ev?.status;
              if (st === 'live_extracted') return <span key={source} className="badge badge-sage">{source}: Live Retrieval Successful</span>;
              if (st === 'fixture_snapshot') return <span key={source} className="badge badge-lavender">{source}: Curated Demo Fixture</span>;
              if (st === 'restricted_login_wall') return <span key={source} className="badge badge-coral">{source}: Restricted by Login Wall</span>;
              if (st === 'rate_limited') return <span key={source} className="badge badge-coral">{source}: Profile Rate Limited</span>;
              return <span key={source} className="badge badge-neutral">{source}: Unavailable</span>;
            };

            return (
              <>
                {renderBadge('LinkedIn', liEv)}
                {renderBadge('Instagram', igEv)}
              </>
            );
          })()}

          <span className="badge badge-sage">
            <ShieldCheck size={12} /> Platform Compliant
          </span>
        </div>

        {/* Informative notice if login wall was encountered */}
        {data.evidences.some((e) => e.status === 'restricted_login_wall') && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(217, 120, 104, 0.1)',
              border: '1px solid rgba(217, 120, 104, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#B24E3F',
            }}
          >
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>
              Unauthenticated crawler request met platform login barriers. In accordance with safety policies, authentication and CAPTCHAs were not bypassed. You can inspect the original public profile directly.
            </span>
          </div>
        )}
      </div>

      {/* Confidence & Evidence Reliability Matrix (Aniwall Layered Panel) */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) minmax(320px, 2fr)',
          gap: '28px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
            Profile Confidence Rating
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 500, color: 'var(--color-ink)' }}>
              {Math.round(profile.confidence.score * 100)}%
            </span>
            <span className={`badge ${profile.confidence.overall === 'HIGH' ? 'badge-sage' : 'badge-neutral'}`}>
              {profile.confidence.overall} RELIABILITY
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginTop: '6px' }}>
            {profile.confidence.rationale}
          </p>
        </div>

        {/* Breakdown Meters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>LinkedIn Professional Narrative</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((profile.confidence.breakdown.linkedinEvidenceScore / 0.5) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(profile.confidence.breakdown.linkedinEvidenceScore / 0.5) * 100}%`, background: 'var(--color-periwinkle)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Instagram Lifestyle & Content Signals</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((profile.confidence.breakdown.instagramEvidenceScore / 0.4) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(profile.confidence.breakdown.instagramEvidenceScore / 0.4) * 100}%`, background: 'var(--color-lavender)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Signal Recency & Consistency</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((profile.confidence.breakdown.recencyScore / 0.1) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(profile.confidence.breakdown.recencyScore / 0.1) * 100}%`, background: 'var(--color-sage)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dossier Body: Facts vs Hypotheses Columns (Arca Editorial Reference) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Column 1: Observed Facts (Verbatim Anchored Evidence) */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#2E7D32" />
              <h2 className="editorial-title" style={{ fontSize: '1.4rem', color: 'var(--color-ink)' }}>
                Observed Facts
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              Directly cited from public LinkedIn & Instagram profile copy
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {profile.observedFacts.map((fact, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span className={`badge ${fact.source === 'linkedin' ? 'badge-periwinkle' : 'badge-lavender'}`} style={{ fontSize: '0.66rem' }}>
                    {fact.source.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-muted-text)' }}>
                    Verbatim Signal
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-ink)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{fact.fact}"
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-secondary-text)', marginTop: '6px' }}>
                  Anchor: {fact.anchor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Inferred Hypotheses & Preferences (Clearly labeled as inferences) */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} color="#55448C" />
              <h2 className="editorial-title" style={{ fontSize: '1.4rem', color: 'var(--color-ink)' }}>
                Inferred Hypotheses
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              Synthesized behavioral patterns with explicit confidence levels
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {profile.hypotheses.map((hyp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-lavender" style={{ fontSize: '0.66rem' }}>
                    {hyp.category.toUpperCase()}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>
                    {hyp.confidence} CONFIDENCE
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                  {hyp.hypothesis}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-secondary-text)', marginTop: '6px', lineHeight: 1.4 }}>
                  Reasoning: {hyp.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Interests, Hobbies & Lifestyle Signals */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.4rem', color: 'var(--color-ink)' }}>
          Profile Facets & Leisure Signals
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
              Supported Interests ({profile.supportedInterests.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.supportedInterests.map((interest, i) => (
                <span key={i} className="badge badge-neutral">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
              Evidenced Hobbies & Downtime
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.hobbies.map((hobby, i) => (
                <span key={i} className="badge badge-lavender">
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
              Lifestyle Rhythm Signals
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.lifestyleSignals.map((signal, i) => (
                <span key={i} className="badge badge-sage">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sensitive Traits Exclusion Policy Banner */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(220, 231, 220, 0.45)',
          border: '1px solid rgba(63, 94, 67, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <ShieldCheck size={18} color="#2E7D32" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-subtle)', lineHeight: 1.5 }}>
          <strong>Ethical AI Guardrail:</strong> Religion, political affiliations, ethnicity, medical conditions, and sexual orientation were excluded from this profile synthesis. Romantic intent is not assumed without explicit public declaration.
        </div>
      </div>
    </div>
  );
};

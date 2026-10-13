import React from 'react';
import { Participant, DatingConversation } from '../types/index.js';
import { IridescentHelix } from './IridescentHelix.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Activity,
  Layers,
  Linkedin,
  Instagram,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface DiscoverViewProps {
  participants: Participant[];
  conversations: DatingConversation[];
  onExploreParticipants: () => void;
  onViewRankings: (participantId?: string) => void;
  onSelectParticipant: (id: string) => void;
  onStartDate: (participantAId: string, participantBId?: string) => void;
  onOpenConversation?: (conversationId: string) => void;
}

/**
 * DiscoverView — Flagsip Editorial First Screen
 * Inspired by Aniwall by ThreeUI (Workspace glass & signature iridescent helix)
 * and Arca (Editorial typography, asymmetric layout)
 */
export const DiscoverView: React.FC<DiscoverViewProps> = ({
  participants,
  conversations,
  onExploreParticipants,
  onViewRankings,
  onSelectParticipant,
  onStartDate,
  onOpenConversation,
}) => {
  // Real backend calculations — ZERO fabricated statistics
  const totalParticipants = participants.length;
  const completedSessions = conversations.filter((c) => c.status === 'completed').length;
  const mutualMatches = conversations.filter((c) => c.decisions?.mutualMatch).length;
  const recentConversations = conversations.slice(0, 4);
  const featuredParticipants = participants.slice(0, 6);

  return (
    <div className="discover-view" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Editorial Hero Section (Aniwall + Arca) */}
      <section
        className="glass-panel"
        style={{
          padding: '48px 48px 40px',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(280px, 0.9fr)',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        {/* Left Column: Editorial Manifesto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-lavender">
              <Sparkles size={12} /> Autonomous Compatibility Synthesis
            </span>
            <span className="badge badge-sage">Zero Paid APIs</span>
          </div>

          <h1 className="editorial-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'var(--color-ink)' }}>
            Chemistry, <span className="editorial-italic">explored</span> by AI.
          </h1>

          <p style={{ fontSize: '1.08rem', color: 'var(--color-ink-subtle)', maxWidth: '540px', lineHeight: 1.68 }}>
            AuraMatch synthesizes autonomous AI agents strictly from public LinkedIn and Instagram profiles. Agents converse across multi-turn sessions, evaluate shared craft and downtime rituals, propose evidence-grounded activities, and make independent continuation decisions.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
            <button className="btn btn-primary" onClick={onExploreParticipants} style={{ padding: '12px 24px' }}>
              Explore Directory <ArrowRight size={15} />
            </button>
            <button className="btn btn-secondary" onClick={() => onViewRankings()} style={{ padding: '12px 22px' }}>
              View Compatibility Rankings
            </button>
          </div>

          {/* Real Backend Statistics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              paddingTop: '24px',
              marginTop: '12px',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                {totalParticipants}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                Demo Participants
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                {completedSessions}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                Persisted Dates
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                {mutualMatches}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                Mutual Matches
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Aniwall Iridescent Helix Signature Visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <IridescentHelix width={380} height={340} />
          {/* Subtle floating badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: 'var(--shadow-card)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--color-ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span className="demo-dot" />
            <span>Dual-Source Profile Engine</span>
          </div>
        </div>
      </section>

      {/* Grid: Featured People Discovery & Recent Activity */}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(280px, 1fr)', gap: '32px' }}>
        {/* Left: Featured Participants Carousel/Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="editorial-title" style={{ fontSize: '1.6rem', color: 'var(--color-ink)' }}>
                Selected Profiles
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary-text)' }}>
                Synthesized strictly from public LinkedIn & Instagram evidence
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onExploreParticipants}>
              View All ({totalParticipants}) <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {featuredParticipants.map((p) => (
              <div
                key={p.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => onSelectParticipant(p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MonogramAvatar name={p.name} size={48} status="fixture" showStatusDot />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500, truncate: true }}>
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.76rem',
                        color: 'var(--color-secondary-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.bioHeadline || 'Public Figure'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    <ShieldCheck size={10} /> Public Fixture
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    <a
                      href={p.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: 'var(--color-secondary-text)', opacity: 0.8 }}
                    >
                      <Linkedin size={13} />
                    </a>
                    <a
                      href={p.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: 'var(--color-secondary-text)', opacity: 0.8 }}
                    >
                      <Instagram size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Dating Activity Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="editorial-title" style={{ fontSize: '1.6rem', color: 'var(--color-ink)' }}>
                Recent Dates
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary-text)' }}>
                Autonomous 4-round sessions evaluated by agents
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onStartDate(participants[0]?.id)}>
              Open Arena <ArrowRight size={14} />
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentConversations.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
                No dates simulated yet. Seed demo or start a session.
              </div>
            ) : (
              recentConversations.map((c) => {
                const isMatch = c.decisions?.mutualMatch;
                return (
                  <div
                    key={c.id}
                    onClick={() => onOpenConversation && onOpenConversation(c.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      cursor: onOpenConversation ? 'pointer' : 'default',
                      transition: 'background 0.15s ease, transform 0.15s ease',
                    }}
                    title="Click to open full dating transcript"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-6px' }}>
                        <MonogramAvatar name={c.participantAName} size={32} />
                        <div style={{ marginLeft: '-10px' }}>
                          <MonogramAvatar name={c.participantBName} size={32} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                          {c.participantAName} & {c.participantBName}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>
                          {c.turns.length} turns • {c.proposedActivity ? c.proposedActivity.activity.slice(0, 32) + '...' : 'Completed'}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${isMatch ? 'badge-sage' : 'badge-neutral'}`}>
                      {isMatch ? (
                        <>
                          <CheckCircle2 size={11} /> Mutual Match
                        </>
                      ) : (
                        <>
                          <XCircle size={11} /> Concluded
                        </>
                      )}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

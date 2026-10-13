import React, { useEffect, useState } from 'react';
import { Participant, DatingConversation } from '../types/index.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import { Sparkles, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';

interface AgentNetworkVisualizerProps {
  participantA: Participant;
  participantB: Participant;
  conversation?: DatingConversation | null;
  currentRound?: number;
  totalRounds?: number;
  isStreaming?: boolean;
}

/**
 * AgentNetworkVisualizer — Agent AI by ThreeUI Reference
 * Meaningful visualization of two agents discussing a match, evaluating evidence,
 * and deciding whether to continue dating.
 */
export const AgentNetworkVisualizer: React.FC<AgentNetworkVisualizerProps> = ({
  participantA,
  participantB,
  conversation,
  currentRound = 4,
  totalRounds = 4,
  isStreaming = false,
}) => {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const decisions = conversation?.decisions;
  const isMatch = decisions?.mutualMatch;
  const isCompleted = conversation?.status === 'completed';

  const evidenceSignals = [
    'Synthesizing LinkedIn Craft & Professional Evidence',
    'Exchanging Instagram Lifestyle & Rhythm Signals',
    'Evaluating Core Principle & Philosophy Resonance',
    'Synthesizing Joint Activity Feasibility & Continuation',
  ];

  return (
    <div
      className="agent-network-visualizer glass-panel"
      style={{
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 245, 240, 0.85) 100%)',
      }}
    >
      {/* Background Spatial Ambience */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '20%',
          width: '320px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(185, 196, 245, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '20%',
          width: '280px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(220, 213, 245, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> Agent-to-Agent Dialogue Matrix
          </span>
          {isStreaming && (
            <span className="badge badge-sage">
              <span className="demo-dot" /> Live Active Date
            </span>
          )}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--color-secondary-text)' }}>
          Round {currentRound} of {totalRounds} • 4 Evidence Phases
        </div>
      </div>

      {/* Two Agents & Connection Beam (Agent AI Architecture) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, 1fr) auto minmax(140px, 1fr)',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
        }}
      >
        {/* Agent Node A */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px rgba(32, 33, 31, 0.05)',
              border: '1px solid var(--color-border-subtle)',
              position: 'relative',
            }}
          >
            <MonogramAvatar name={participantA.name} size={64} status="fixture" showStatusDot />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500 }}>
              {participantA.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
              Agent Persona A
            </div>
          </div>
          {decisions && (
            <span className={`badge ${decisions.participantAContinue ? 'badge-sage' : 'badge-coral'}`}>
              {decisions.participantAContinue ? (
                <>
                  <CheckCircle2 size={12} /> Accepted Next Date
                </>
              ) : (
                <>
                  <XCircle size={12} /> Polite Decline
                </>
              )}
            </span>
          )}
        </div>

        {/* Central Evidence Exchange Bridge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            minWidth: '160px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '2px',
                width: '100%',
                background: 'linear-gradient(90deg, var(--color-periwinkle) 0%, var(--color-lavender) 50%, var(--color-coral) 100%)',
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 2px 8px rgba(32, 33, 31, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ink)',
              }}
            >
              <ArrowRightLeft size={14} />
            </div>
          </div>

          {/* Current Signal Exchange Pill */}
          <div
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--color-border-subtle)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.74rem',
              color: 'var(--color-ink-subtle)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            {evidenceSignals[pulseIndex]}
          </div>
        </div>

        {/* Agent Node B */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px rgba(32, 33, 31, 0.05)',
              border: '1px solid var(--color-border-subtle)',
              position: 'relative',
            }}
          >
            <MonogramAvatar name={participantB.name} size={64} status="fixture" showStatusDot />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500 }}>
              {participantB.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
              Agent Persona B
            </div>
          </div>
          {decisions && (
            <span className={`badge ${decisions.participantBContinue ? 'badge-sage' : 'badge-coral'}`}>
              {decisions.participantBContinue ? (
                <>
                  <CheckCircle2 size={12} /> Accepted Next Date
                </>
              ) : (
                <>
                  <XCircle size={12} /> Polite Decline
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Outcome Verdict Summary Banner */}
      {isCompleted && decisions && (
        <div
          style={{
            marginTop: '24px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: isMatch ? 'rgba(220, 231, 220, 0.55)' : 'rgba(255, 255, 255, 0.75)',
            border: `1px solid ${isMatch ? 'rgba(63, 94, 67, 0.2)' : 'var(--color-border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isMatch ? '#2E7D32' : 'var(--color-secondary-text)',
              }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--color-ink)' }}>
              {isMatch
                ? 'Mutual Alignment Achieved — Both Agents Decided to Continue Dating'
                : 'Session Completed — Divergent Pursuits or Selectivity Led to Courteous Closure'}
            </span>
          </div>

          <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>
            Status: Completed
          </span>
        </div>
      )}
    </div>
  );
};

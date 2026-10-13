import React, { useState, useEffect, useRef } from 'react';
import {
  Participant,
  DatingConversation,
  ConversationTurn,
} from '../types/index.js';
import {
  fetchConversations,
  fetchConversationDetail,
  subscribeLiveDate,
} from '../services/api.js';
import { AgentNetworkVisualizer } from './AgentNetworkVisualizer.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import {
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  Calendar,
  Zap,
  Tag,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Award,
} from 'lucide-react';

interface DatingTimelineProps {
  participants: Participant[];
  initialParticipantAId?: string;
  initialParticipantBId?: string;
  onViewRankings: (participantId: string) => void;
}

export const DatingTimeline: React.FC<DatingTimelineProps> = ({
  participants,
  initialParticipantAId,
  initialParticipantBId,
  onViewRankings,
}) => {
  const [participantAId, setParticipantAId] = useState(
    initialParticipantAId || participants[0]?.id || ''
  );
  const [participantBId, setParticipantBId] = useState(
    initialParticipantBId || (participants.length > 1 ? participants[1]?.id : '')
  );

  const [existingConversations, setExistingConversations] = useState<DatingConversation[]>([]);
  const [selectedPastConvId, setSelectedPastConvId] = useState<string>('');

  const [activeConversation, setActiveConversation] = useState<DatingConversation | null>(null);
  const [displayedTurns, setDisplayedTurns] = useState<ConversationTurn[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(4);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>('Select two agents and start date');

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Load existing conversations on mount
  useEffect(() => {
    fetchConversations()
      .then((convs) => {
        setExistingConversations(convs);
        if (convs.length > 0 && !activeConversation) {
          loadPastConversation(convs[0].id);
        }
      })
      .catch(console.error);

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  // Auto-scroll timeline feed
  useEffect(() => {
    if (isSimulating) {
      timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedTurns, isSimulating]);

  const loadPastConversation = async (convId: string) => {
    if (!convId) return;
    try {
      const full = await fetchConversationDetail(convId);
      setActiveConversation(full);
      setParticipantAId(full.participantAId);
      setParticipantBId(full.participantBId);
      setDisplayedTurns(full.turns);
      setCurrentRound(full.rounds);
      setSelectedPastConvId(convId);
      setStatusMessage(`Loaded recorded date from ${new Date(full.createdAt).toLocaleDateString()}`);
    } catch (err: any) {
      console.error('Failed to load past conversation:', err);
    }
  };

  const startLiveSimulation = () => {
    if (!participantAId || !participantBId || participantAId === participantBId) {
      alert('Please select two distinct participants.');
      return;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setIsSimulating(true);
    setDisplayedTurns([]);
    setActiveConversation(null);
    setCurrentRound(1);
    setStatusMessage('Connecting to real-time dating engine...');

    const unsub = subscribeLiveDate(
      participantAId,
      participantBId,
      speedMultiplier,
      (event) => {
        if (event.type === 'DATE_STARTED') {
          setStatusMessage('Date initiated! Agents are synthesizing persona introductions...');
        } else if (event.type === 'TURN_GENERATED') {
          setDisplayedTurns((prev) => [...prev, event.turn]);
          setCurrentRound(event.turn.round);
        } else if (event.type === 'DATE_COMPLETED') {
          setActiveConversation(event.conversation);
          setIsSimulating(false);
          setStatusMessage('Date session concluded. Continuation decisions recorded.');
          fetchConversations().then(setExistingConversations).catch(console.error);
        }
      },
      (error) => {
        console.error('SSE Error:', error);
        setIsSimulating(false);
        setStatusMessage('Simulation streaming encountered an issue.');
      }
    );

    unsubscribeRef.current = unsub;
  };

  const currentParticipantA = participants.find((p) => p.id === participantAId) || participants[0];
  const currentParticipantB = participants.find((p) => p.id === participantBId) || participants[1] || participants[0];

  const roundNames = [
    'Round 1: Persona Introductions & Craft',
    'Round 2: Downtime Rituals & Leisure Rhythm',
    'Round 3: Core Convictions & Craft Mastery',
    'Round 4: Activity Proposal & Continuation Decision',
  ];

  return (
    <div className="dating-timeline-view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Editorial View Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> Agent AI Dialogue Arena
          </span>
          <span className="badge badge-neutral">Autonomous 4-Round Exchange</span>
        </div>
        <h1 className="editorial-title" style={{ fontSize: '2.4rem', color: 'var(--color-ink)' }}>
          Dating Sessions
        </h1>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.96rem' }}>
          Watch autonomous agents converse across four structured rounds, proposing real-world activities and deciding independently whether to pursue further connection.
        </p>
      </div>

      {/* Control Panel: Pair Selector & Playback */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Participant A Picker */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
              Participant A (Lead Speaker)
            </label>
            <select
              className="input-editorial"
              value={participantAId}
              onChange={(e) => setParticipantAId(e.target.value)}
              disabled={isSimulating}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === participantBId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Participant B Picker */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
              Participant B (Second Speaker)
            </label>
            <select
              className="input-editorial"
              value={participantBId}
              onChange={(e) => setParticipantBId(e.target.value)}
              disabled={isSimulating}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === participantAId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Action */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              className="btn btn-primary"
              onClick={startLiveSimulation}
              disabled={isSimulating}
              style={{ width: '100%', padding: '11px 24px' }}
            >
              {isSimulating ? (
                <>
                  <span className="demo-dot" /> Streaming Date...
                </>
              ) : (
                <>
                  <Play size={15} /> Start Live Date
                </>
              )}
            </button>
          </div>
        </div>

        {/* Playback Controls & Replay Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)' }}>
              Replay Persisted Date:
            </span>
            <select
              className="input-editorial"
              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
              value={selectedPastConvId}
              onChange={(e) => loadPastConversation(e.target.value)}
              disabled={isSimulating}
            >
              <option value="">-- Choose past date ({existingConversations.length}) --</option>
              {existingConversations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.participantAName} & {c.participantBName} ({c.decisions?.mutualMatch ? 'Match' : 'Concluded'})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)' }}>
              Speed:
            </span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                className={`btn btn-xs ${speedMultiplier === spd ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSpeedMultiplier(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Agent AI Visualizer Node */}
      {currentParticipantA && currentParticipantB && (
        <AgentNetworkVisualizer
          participantA={currentParticipantA}
          participantB={currentParticipantB}
          conversation={activeConversation}
          currentRound={currentRound}
          totalRounds={4}
          isStreaming={isSimulating}
        />
      )}

      {/* 4-Round Progress Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {[1, 2, 3, 4].map((r) => {
          const isPassed = displayedTurns.some((t) => t.round >= r);
          const isCurrent = currentRound === r && isSimulating;
          return (
            <div
              key={r}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isPassed
                  ? 'rgba(220, 213, 245, 0.45)'
                  : 'rgba(32, 33, 31, 0.03)',
                border: isCurrent
                  ? '1px solid var(--color-ink)'
                  : '1px solid var(--color-border-subtle)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: isPassed ? 'var(--color-ink)' : 'var(--color-muted-text)' }}>
                ROUND {r}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 500, color: isPassed ? 'var(--color-ink)' : 'var(--color-muted-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r === 1 ? 'Introductions' : r === 2 ? 'Downtime' : r === 3 ? 'Principles' : 'Continuation'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chronological Conversation Dialogue Stream */}
      <div className="conversation-stream" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {displayedTurns.length === 0 ? (
          <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
            <MessageSquare size={32} color="var(--color-secondary-text)" style={{ margin: '0 auto 12px' }} />
            <h3 className="editorial-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
              No messages displayed
            </h3>
            <p style={{ color: 'var(--color-secondary-text)' }}>
              Click "Start Live Date" to stream an autonomous conversation or select a recorded date from the dropdown above.
            </p>
          </div>
        ) : (
          displayedTurns.map((turn, index) => {
            const isSpeakerA = turn.speakerId === participantAId;
            return (
              <div
                key={turn.id || index}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start',
                  borderLeft: isSpeakerA
                    ? '4px solid var(--color-periwinkle)'
                    : '4px solid var(--color-lavender)',
                }}
              >
                <MonogramAvatar name={turn.speakerName} size={44} status="fixture" />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Speaker Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                        {turn.speakerName}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>
                        Round {turn.round}
                      </span>
                    </div>

                    <span className="badge badge-lavender" style={{ fontSize: '0.66rem' }}>
                      {turn.topic}
                    </span>
                  </div>

                  {/* Verbatim Dialogue Bubble */}
                  <div
                    style={{
                      fontSize: '0.96rem',
                      lineHeight: 1.68,
                      color: 'var(--color-ink)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    "{turn.message}"
                  </div>

                  {/* Supporting Evidence Chips Tagged on Turn */}
                  {turn.supportingEvidenceUsed && turn.supportingEvidenceUsed.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-secondary-text)' }}>
                        Evidence Used:
                      </span>
                      {turn.supportingEvidenceUsed.map((ev, ei) => (
                        <span key={ei} className="badge badge-neutral" style={{ fontSize: '0.66rem', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <Tag size={9} /> {ev}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={timelineEndRef} />
      </div>

      {/* Completion & Continuation Decision Dossier (Aniwall Layered Surface) */}
      {activeConversation && activeConversation.decisions && (
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(247, 245, 240, 0.9) 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-lavender">Session Verdict</span>
              <span className={`badge ${activeConversation.decisions.mutualMatch ? 'badge-sage' : 'badge-coral'}`}>
                {activeConversation.decisions.mutualMatch ? 'Mutual Match' : 'Single / Incompatible'}
              </span>
            </div>
            <h2 className="editorial-title" style={{ fontSize: '1.8rem', color: 'var(--color-ink)' }}>
              Continuation Decisions & Activity Proposal
            </h2>
          </div>

          {/* Activity Proposal Banner */}
          {activeConversation.proposedActivity && (
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(185, 196, 245, 0.25)',
                border: '1px solid rgba(185, 196, 245, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
                  Proposed Joint Experience
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '2px' }}>
                  {activeConversation.proposedActivity.activity}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                  Rationale: {activeConversation.proposedActivity.rationale}
                </div>
              </div>

              <span className={`badge ${activeConversation.proposedActivity.acceptedByOther ? 'badge-sage' : 'badge-coral'}`}>
                {activeConversation.proposedActivity.acceptedByOther ? 'Accepted by Partner' : 'Declined / Pivoted'}
              </span>
            </div>
          )}

          {/* Independent Decisions Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {/* Participant A Decision */}
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{activeConversation.participantAName}</span>
                <span className={`badge ${activeConversation.decisions.participantAContinue ? 'badge-sage' : 'badge-coral'}`}>
                  {activeConversation.decisions.participantAContinue ? (
                    <>
                      <CheckCircle2 size={11} /> Continue Dating
                    </>
                  ) : (
                    <>
                      <XCircle size={11} /> Decline
                    </>
                  )}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-subtle)', lineHeight: 1.5 }}>
                "{activeConversation.decisions.participantAReason}"
              </p>
            </div>

            {/* Participant B Decision */}
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{activeConversation.participantBName}</span>
                <span className={`badge ${activeConversation.decisions.participantBContinue ? 'badge-sage' : 'badge-coral'}`}>
                  {activeConversation.decisions.participantBContinue ? (
                    <>
                      <CheckCircle2 size={11} /> Continue Dating
                    </>
                  ) : (
                    <>
                      <XCircle size={11} /> Decline
                    </>
                  )}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-subtle)', lineHeight: 1.5 }}>
                "{activeConversation.decisions.participantBReason}"
              </p>
            </div>
          </div>

          {/* Action Link to Rankings */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => onViewRankings(activeConversation.participantAId)}
            >
              <Award size={15} /> View Full Compatibility Rankings <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

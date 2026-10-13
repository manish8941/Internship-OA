import React, { useEffect, useState } from 'react';
import { DatingConversation } from '../types/index.js';
import { fetchConversationDetail } from '../services/api.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import { X, Calendar, Heart, Tag, MessageSquare, Award, CheckCircle2, XCircle } from 'lucide-react';

interface ConversationDetailProps {
  conversationId: string;
  onClose: () => void;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversationId,
  onClose,
}) => {
  const [conversation, setConversation] = useState<DatingConversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversationDetail(conversationId)
      .then((c) => {
        setConversation(c);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [conversationId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-wrapper"
        style={{ maxWidth: '820px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-lavender">
              <MessageSquare size={13} /> Transcript Record
            </span>
            <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--color-ink)' }}>
              {conversation ? `${conversation.participantAName} & ${conversation.participantBName}` : 'Recorded Session'}
            </h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
            Loading recorded transcript...
          </div>
        ) : conversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Meta Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">{conversation.rounds} Rounds • 8 Turns</span>
              <span className="badge badge-neutral">{new Date(conversation.createdAt).toLocaleDateString()}</span>
              <span className={`badge ${conversation.decisions?.mutualMatch ? 'badge-sage' : 'badge-neutral'}`}>
                {conversation.decisions?.mutualMatch ? (
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

            {/* Turns Stream */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '440px',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {conversation.turns.map((turn, idx) => {
                const isSpeakerA = turn.speakerId === conversation.participantAId;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(247, 245, 240, 0.65)',
                      border: '1px solid var(--color-border-subtle)',
                      borderLeft: `3px solid ${isSpeakerA ? 'var(--color-periwinkle)' : 'var(--color-lavender)'}`,
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                        {turn.speakerName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                        Round {turn.round} • {turn.topic}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--color-ink)', lineHeight: 1.6 }}>
                      "{turn.message}"
                    </p>

                    {turn.supportingEvidenceUsed && turn.supportingEvidenceUsed.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {turn.supportingEvidenceUsed.map((ev, eIdx) => (
                          <span key={eIdx} className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>
                            <Tag size={9} /> {ev}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Activity Proposal if present */}
            {conversation.proposedActivity && (
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(185, 196, 245, 0.2)',
                  border: '1px solid rgba(185, 196, 245, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Round 4 Proposed Activity
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 500, color: 'var(--color-ink)', marginTop: '2px' }}>
                    {conversation.proposedActivity.activity}
                  </div>
                  {conversation.proposedActivity.rationale && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                      Rationale: {conversation.proposedActivity.rationale}
                    </div>
                  )}
                </div>
                <span className={`badge ${conversation.proposedActivity.acceptedByOther ? 'badge-sage' : 'badge-coral'}`}>
                  {conversation.proposedActivity.acceptedByOther ? 'Accepted by Partner' : 'Declined / Incompatible'}
                </span>
              </div>
            )}

            {/* Continuation Decisions Outcome */}
            {conversation.decisions && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
                    Autonomous Continuation Decisions
                  </div>
                  <span className={`badge ${conversation.decisions.mutualMatch ? 'badge-sage' : 'badge-coral'}`}>
                    {conversation.decisions.mutualMatch ? 'Mutual Match' : 'Single / Incompatible'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '4px' }}>
                  {/* Participant A Decision */}
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(247, 245, 240, 0.65)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{conversation.participantAName}</span>
                      <span className={`badge ${conversation.decisions.participantAContinue ? 'badge-sage' : 'badge-coral'}`}>
                        {conversation.decisions.participantAContinue ? (
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
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-subtle)', lineHeight: 1.5 }}>
                      "{conversation.decisions.participantAReason}"
                    </p>
                  </div>

                  {/* Participant B Decision */}
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(247, 245, 240, 0.65)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{conversation.participantBName}</span>
                      <span className={`badge ${conversation.decisions.participantBContinue ? 'badge-sage' : 'badge-coral'}`}>
                        {conversation.decisions.participantBContinue ? (
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
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-subtle)', lineHeight: 1.5 }}>
                      "{conversation.decisions.participantBReason}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

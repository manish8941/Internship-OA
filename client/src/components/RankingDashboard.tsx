import React, { useState, useEffect } from 'react';
import { Participant, PersonalizedRanking, RankedCandidate } from '../types/index.js';
import { fetchRankings } from '../services/api.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import {
  Award,
  Heart,
  MessageSquare,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface RankingDashboardProps {
  participants: Participant[];
  initialParticipantId?: string;
  onOpenConversation: (conversationId: string) => void;
  onSimulateMore: (participantId: string) => void;
}

export const RankingDashboard: React.FC<RankingDashboardProps> = ({
  participants,
  initialParticipantId,
  onOpenConversation,
  onSimulateMore,
}) => {
  const [targetId, setTargetId] = useState<string>(
    initialParticipantId || participants[0]?.id || ''
  );
  const [rankingData, setRankingData] = useState<PersonalizedRanking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    setError(null);
    fetchRankings(targetId)
      .then((data) => {
        setRankingData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'No ranking records found for this participant');
      });
  }, [targetId]);

  const targetParticipant = participants.find((p) => p.id === targetId) || participants[0];

  return (
    <div className="ranking-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Editorial View Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> 5-Pillar Compatibility Matrix
          </span>
          <span className="badge badge-neutral">Algorithmic Evidence Grounding</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="editorial-title" style={{ fontSize: '2.4rem', color: 'var(--color-ink)' }}>
              Compatibility Rankings
            </h1>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.96rem' }}>
              Personalized compatibility evaluations derived strictly from persisted dual-source analysis and multi-turn conversations.
            </p>
          </div>

          {/* Participant Selector */}
          <div style={{ minWidth: '260px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block', marginBottom: '6px' }}>
              Target Participant Evaluation:
            </label>
            <select
              className="input-editorial"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
          <div className="demo-dot" style={{ margin: '0 auto 16px', width: '12px', height: '12px' }} />
          <p style={{ color: 'var(--color-secondary-text)' }}>Calculating personalized 5-pillar compatibility rankings...</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
          <Award size={32} color="var(--color-secondary-text)" style={{ margin: '0 auto 12px' }} />
          <h3 className="editorial-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
            No Dating Records Yet
          </h3>
          <p style={{ color: 'var(--color-secondary-text)', maxWidth: '480px', margin: '0 auto 20px' }}>
            {targetParticipant?.name} has not participated in recorded dates yet. Start a simulation to generate personalized compatibility rankings!
          </p>
          <button className="btn btn-primary" onClick={() => onSimulateMore(targetId)}>
            <Heart size={14} /> Start Date for {targetParticipant?.name}
          </button>
        </div>
      )}

      {!loading && rankingData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Target Participant Summary Card */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <MonogramAvatar name={rankingData.targetParticipant.name} size={64} status="fixture" />
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '4px' }}>
                  Target Subject
                </span>
                <h2 className="editorial-title" style={{ fontSize: '1.6rem', color: 'var(--color-ink)' }}>
                  {rankingData.targetParticipant.name}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-secondary-text)' }}>
                  Ranked against {rankingData.rankedCandidates.length} evaluated candidate agents
                </p>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onSimulateMore(targetId)}>
              <Heart size={13} /> Simulate More Dates
            </button>
          </div>

          {/* Ranked Candidates List (Arca Editorial Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {rankingData.rankedCandidates.map((cand, index) => {
              const isMatch = cand.mutualInterestIndicator === 'MUTUAL_MATCH';
              const isOneWay = cand.mutualInterestIndicator === 'ONE_WAY_INTEREST';

              return (
                <div
                  key={cand.candidateId}
                  className="glass-panel"
                  style={{
                    padding: '28px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    position: 'relative',
                  }}
                >
                  {/* Top Row: Rank Badge, Candidate Info, Score Number */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: index === 0 ? 'var(--color-ink)' : 'rgba(32, 33, 31, 0.06)',
                          color: index === 0 ? 'var(--color-white)' : 'var(--color-ink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        #{index + 1}
                      </div>

                      <MonogramAvatar name={cand.candidateName} size={54} status="fixture" />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 className="editorial-title" style={{ fontSize: '1.35rem', color: 'var(--color-ink)' }}>
                            {cand.candidateName}
                          </h3>
                          <span
                            className={`badge ${
                              isMatch ? 'badge-sage' : isOneWay ? 'badge-lavender' : 'badge-neutral'
                            }`}
                          >
                            {cand.mutualInterestIndicator.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
                          {cand.candidateHeadline || 'Public Profile'}
                        </p>
                      </div>
                    </div>

                    {/* Overall Score Badge */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 500, color: 'var(--color-ink)', lineHeight: 1 }}>
                        {cand.overallScore}
                        <span style={{ fontSize: '1rem', color: 'var(--color-muted-text)', fontFamily: 'var(--font-sans)' }}>/100</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
                        Composite Compatibility
                      </div>
                    </div>
                  </div>

                  {/* 5-Pillar Horizontal Score Bars (Refined Minimalist Visualizer) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '14px',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(247, 245, 240, 0.55)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span>Shared Interests</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cand.breakdown.sharedInterestsScore}/30</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(cand.breakdown.sharedInterestsScore / 30) * 100}%`, background: 'var(--color-periwinkle)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span>Preference Alignment</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cand.breakdown.preferenceAlignmentScore}/25</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(cand.breakdown.preferenceAlignmentScore / 25) * 100}%`, background: 'var(--color-lavender)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span>Complementary Goals</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cand.breakdown.complementaryGoalsScore}/20</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(cand.breakdown.complementaryGoalsScore / 20) * 100}%`, background: 'var(--color-coral)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span>Conversation Quality</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cand.breakdown.conversationQualityScore}/15</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(cand.breakdown.conversationQualityScore / 15) * 100}%`, background: 'var(--color-sage-dark)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span>Data Confidence</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cand.breakdown.dataConfidenceScore}/10</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(32, 33, 31, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(cand.breakdown.dataConfidenceScore / 10) * 100}%`, background: 'var(--color-ink)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Qualitative Explanation from Backend */}
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-ink-subtle)', lineHeight: 1.6 }}>
                    <strong>Qualitative Analysis:</strong> {cand.explanation}
                  </div>

                  {/* Frictions or Disclaimers */}
                  {(cand as any).potentialFrictions && (cand as any).potentialFrictions.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                      <AlertCircle size={13} color="var(--color-coral)" />
                      <span>{(cand as any).potentialFrictions[0]}</span>
                    </div>
                  )}

                  {/* Action Link to Full Transcript */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenConversation(cand.conversationId)}
                    >
                      <MessageSquare size={13} /> View 8-Turn Dating Transcript <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

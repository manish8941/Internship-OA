import {
  Participant,
  AnalyzedProfile,
  DatingConversation,
  ConversationTurn,
  ProposedActivity,
  DatingDecisions,
} from '../types/index.js';
import { DatingAgent } from './agent.js';
import { saveConversation, saveCompatibilityScore } from '../db/database.js';
import { evaluateCompatibility } from '../ranking/ranker.js';

export interface TurnCallback {
  (turn: ConversationTurn, progress: { currentTurn: number; totalTurns: number }): void | Promise<void>;
}

export async function runDatingConversation(
  participantA: Participant,
  participantB: Participant,
  profileA: AnalyzedProfile,
  profileB: AnalyzedProfile,
  onTurnGenerated?: TurnCallback
): Promise<DatingConversation> {
  const conversationId = `conv-${participantA.id}-x-${participantB.id}-${Date.now()}`;
  const agentA = new DatingAgent(participantA, profileA);
  const agentB = new DatingAgent(participantB, profileB);

  const turns: ConversationTurn[] = [];
  let proposedActivity: ProposedActivity | null = null;
  const totalRounds = 4;
  const totalTurns = totalRounds * 2;

  for (let round = 1; round <= totalRounds; round++) {
    // Speaker 1: Agent A
    const turnAOutput = agentA.generateTurn(round, true, agentB, turns);
    if (turnAOutput.proposedActivity) {
      proposedActivity = turnAOutput.proposedActivity;
    }
    const turnA: ConversationTurn = {
      id: `turn-${conversationId}-r${round}-a`,
      conversationId,
      round,
      speakerId: participantA.id,
      speakerName: participantA.name,
      message: turnAOutput.message,
      supportingEvidenceUsed: turnAOutput.supportingEvidenceUsed,
      topic: turnAOutput.topic,
      sentiment: turnAOutput.sentiment,
      timestamp: new Date().toISOString(),
    };
    turns.push(turnA);
    if (onTurnGenerated) {
      await onTurnGenerated(turnA, { currentTurn: turns.length, totalTurns });
    }

    // Speaker 2: Agent B
    const turnBOutput = agentB.generateTurn(round, false, agentA, turns);
    const turnB: ConversationTurn = {
      id: `turn-${conversationId}-r${round}-b`,
      conversationId,
      round,
      speakerId: participantB.id,
      speakerName: participantB.name,
      message: turnBOutput.message,
      supportingEvidenceUsed: turnBOutput.supportingEvidenceUsed,
      topic: turnBOutput.topic,
      sentiment: turnBOutput.sentiment,
      timestamp: new Date().toISOString(),
    };
    turns.push(turnB);
    if (onTurnGenerated) {
      await onTurnGenerated(turnB, { currentTurn: turns.length, totalTurns });
    }
  }

  // Independent Continuation Decisions
  const decA = agentA.decideContinuation(agentB, turns);
  const decB = agentB.decideContinuation(agentA, turns);

  if (proposedActivity) {
    proposedActivity.acceptedByOther = decB.continue;
  }

  const decisions: DatingDecisions = {
    participantAContinue: decA.continue,
    participantAReason: decA.reason,
    participantBContinue: decB.continue,
    participantBReason: decB.reason,
    mutualMatch: decA.continue && decB.continue,
  };

  const conversation: DatingConversation = {
    id: conversationId,
    participantAId: participantA.id,
    participantBId: participantB.id,
    participantAName: participantA.name,
    participantBName: participantB.name,
    status: 'completed',
    rounds: totalRounds,
    turns,
    proposedActivity,
    decisions,
    createdAt: turns[0].timestamp,
    completedAt: new Date().toISOString(),
  };

  // Persist conversation
  await saveConversation(conversation);

  // Evaluate and persist compatibility score
  const score = evaluateCompatibility(conversation, profileA, profileB);
  await saveCompatibilityScore(score);

  return conversation;
}

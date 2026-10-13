import { Response } from 'express';
import { Participant, AnalyzedProfile, DatingConversation, ConversationTurn } from '../types/index.js';
import { runDatingConversation } from './harness.js';
import {
  getParticipantById,
  getAnalyzedProfileByParticipantId,
  getAllConversations,
} from '../db/database.js';

export class DatingSimulator {
  public static async streamLiveDate(
    participantAId: string,
    participantBId: string,
    delayMs: number,
    res: Response
  ): Promise<DatingConversation | null> {
    const pA = await getParticipantById(participantAId);
    const pB = await getParticipantById(participantBId);
    if (!pA || !pB) {
      res.write(`data: ${JSON.stringify({ error: 'Participants not found' })}\n\n`);
      res.end();
      return null;
    }

    const profA = await getAnalyzedProfileByParticipantId(participantAId);
    const profB = await getAnalyzedProfileByParticipantId(participantBId);
    if (!profA || !profB) {
      res.write(`data: ${JSON.stringify({ error: 'Profiles not analyzed yet' })}\n\n`);
      res.end();
      return null;
    }

    // Send initial start event
    res.write(`data: ${JSON.stringify({ type: 'DATE_STARTED', participantA: pA, participantB: pB })}\n\n`);

    const conv = await runDatingConversation(
      pA,
      pB,
      profA,
      profB,
      async (turn: ConversationTurn, progress) => {
        res.write(
          `data: ${JSON.stringify({
            type: 'TURN_GENERATED',
            turn,
            progress,
          })}\n\n`
        );
        // Delay to allow evaluator to watch live
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    );

    res.write(`data: ${JSON.stringify({ type: 'DATE_COMPLETED', conversation: conv })}\n\n`);
    res.end();
    return conv;
  }

  public static async runBatchDates(
    participants: Participant[],
    profilesMap: Map<string, AnalyzedProfile>,
    maxDatesPerParticipant: number = 3
  ): Promise<number> {
    let createdCount = 0;
    const existingConvs = await getAllConversations();
    const existingPairs = new Set<string>();

    for (const c of existingConvs) {
      existingPairs.add(`${c.participantAId}::${c.participantBId}`);
      existingPairs.add(`${c.participantBId}::${c.participantAId}`);
    }

    for (let i = 0; i < participants.length; i++) {
      let datesForI = 0;
      for (let j = 0; j < participants.length; j++) {
        if (i === j) continue;
        const pA = participants[i];
        const pB = participants[j];

        const pairKey = `${pA.id}::${pB.id}`;
        if (existingPairs.has(pairKey)) continue;

        const profA = profilesMap.get(pA.id);
        const profB = profilesMap.get(pB.id);
        if (!profA || !profB) continue;

        await runDatingConversation(pA, pB, profA, profB);
        existingPairs.add(pairKey);
        existingPairs.add(`${pB.id}::${pA.id}`);
        createdCount++;
        datesForI++;

        if (datesForI >= maxDatesPerParticipant) break;
      }
    }

    return createdCount;
  }
}

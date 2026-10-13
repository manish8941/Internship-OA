import test from 'node:test';
import assert from 'node:assert';
import { initDatabase, saveParticipant, saveAnalyzedProfile } from '../src/db/database.js';
import { runDatingConversation } from '../src/dating/harness.js';
import { evaluateCompatibility, generatePersonalizedRanking } from '../src/ranking/ranker.js';
import { extractLinkedInProfile } from '../src/adapters/linkedin.adapter.js';
import { extractInstagramProfile } from '../src/adapters/instagram.adapter.js';
import { analyzeParticipantEvidence } from '../src/analysis/analyzer.js';
import { Participant } from '../src/types/index.js';

test('evaluateCompatibility computes balanced scores across 5 pillars', async () => {
  await initDatabase('file:./data/test_dating_platform.db');

  const pA: Participant = {
    id: `rank-test-a-${Date.now()}`,
    name: 'Andrej Karpathy',
    linkedinUrl: 'https://www.linkedin.com/in/andrejkarpathy',
    instagramUrl: 'https://www.instagram.com/karpathy',
    createdAt: new Date().toISOString(),
  };

  const pB: Participant = {
    id: `rank-test-b-${Date.now()}`,
    name: 'Fei-Fei Li',
    linkedinUrl: 'https://www.linkedin.com/in/feifeili',
    instagramUrl: 'https://www.instagram.com/drfeifeili',
    createdAt: new Date().toISOString(),
  };

  await saveParticipant(pA);
  await saveParticipant(pB);

  const [liA, igA] = await Promise.all([
    extractLinkedInProfile({ participantId: pA.id, url: pA.linkedinUrl, name: pA.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pA.id, url: pA.instagramUrl, name: pA.name, forceFixture: true }),
  ]);
  const profA = analyzeParticipantEvidence(pA, liA, igA);
  await saveAnalyzedProfile(profA);

  const [liB, igB] = await Promise.all([
    extractLinkedInProfile({ participantId: pB.id, url: pB.linkedinUrl, name: pB.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pB.id, url: pB.instagramUrl, name: pB.name, forceFixture: true }),
  ]);
  const profB = analyzeParticipantEvidence(pB, liB, igB);
  await saveAnalyzedProfile(profB);

  const conv = await runDatingConversation(pA, pB, profA, profB);
  const score = evaluateCompatibility(conv, profA, profB);

  assert.ok(score.overallScore >= 0 && score.overallScore <= 100);
  assert.ok(score.breakdown.sharedInterestsScore <= 30);
  assert.ok(score.breakdown.preferenceAlignmentScore <= 25);
  assert.ok(score.breakdown.complementaryGoalsScore <= 20);
  assert.ok(score.breakdown.conversationQualityScore <= 15);
  assert.ok(score.breakdown.dataConfidenceScore <= 10);
  assert.ok(['MUTUAL_MATCH', 'ONE_WAY_INTEREST', 'POLITE_ACQUAINTANCE', 'INCOMPATIBLE'].includes(score.mutualInterestIndicator));
  assert.ok(score.explanation.length > 20);
});

test('generatePersonalizedRanking produces candidate list derived from persisted conversation and score records', async () => {
  await initDatabase('file:./data/test_dating_platform.db');

  const pTarget: Participant = {
    id: `rank-target-${Date.now()}`,
    name: 'Marques Brownlee',
    linkedinUrl: 'https://www.linkedin.com/in/mkbhd',
    instagramUrl: 'https://www.instagram.com/mkbhd',
    createdAt: new Date().toISOString(),
  };

  const pCandidate: Participant = {
    id: `rank-cand-${Date.now()}`,
    name: 'Simone Giertz',
    linkedinUrl: 'https://www.linkedin.com/in/simonegiertz',
    instagramUrl: 'https://www.instagram.com/simonegiertz',
    createdAt: new Date().toISOString(),
  };

  await saveParticipant(pTarget);
  await saveParticipant(pCandidate);

  const [liT, igT] = await Promise.all([
    extractLinkedInProfile({ participantId: pTarget.id, url: pTarget.linkedinUrl, name: pTarget.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pTarget.id, url: pTarget.instagramUrl, name: pTarget.name, forceFixture: true }),
  ]);
  const profT = analyzeParticipantEvidence(pTarget, liT, igT);
  await saveAnalyzedProfile(profT);

  const [liC, igC] = await Promise.all([
    extractLinkedInProfile({ participantId: pCandidate.id, url: pCandidate.linkedinUrl, name: pCandidate.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pCandidate.id, url: pCandidate.instagramUrl, name: pCandidate.name, forceFixture: true }),
  ]);
  const profC = analyzeParticipantEvidence(pCandidate, liC, igC);
  await saveAnalyzedProfile(profC);

  await runDatingConversation(pTarget, pCandidate, profT, profC);

  const ranking = await generatePersonalizedRanking(pTarget.id);
  assert.ok(ranking);
  assert.strictEqual(ranking.targetParticipant.id, pTarget.id);
  assert.ok(ranking.rankedCandidates.length >= 1);
  assert.strictEqual(ranking.rankedCandidates[0].candidateId, pCandidate.id);
  assert.ok(ranking.rankedCandidates[0].overallScore > 0);
  assert.ok(ranking.rankedCandidates[0].conversationId);
});

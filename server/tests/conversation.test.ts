import test from 'node:test';
import assert from 'node:assert';
import { initDatabase, saveParticipant, saveAnalyzedProfile, getConversationById } from '../src/db/database.js';
import { runDatingConversation } from '../src/dating/harness.js';
import { extractLinkedInProfile } from '../src/adapters/linkedin.adapter.js';
import { extractInstagramProfile } from '../src/adapters/instagram.adapter.js';
import { analyzeParticipantEvidence } from '../src/analysis/analyzer.js';
import { Participant } from '../src/types/index.js';

test('runDatingConversation executes multi-turn interaction, activity proposal, decisions, and persists to SQLite', async () => {
  await initDatabase('file:./data/test_dating_platform.db');

  const pA: Participant = {
    id: `test-agent-a-${Date.now()}`,
    name: 'Mira Murati',
    linkedinUrl: 'https://www.linkedin.com/in/miramurati',
    instagramUrl: 'https://www.instagram.com/miramurati',
    createdAt: new Date().toISOString(),
  };

  const pB: Participant = {
    id: `test-agent-b-${Date.now()}`,
    name: 'Simone Giertz',
    linkedinUrl: 'https://www.linkedin.com/in/simonegiertz',
    instagramUrl: 'https://www.instagram.com/simonegiertz',
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

  // Run dating conversation
  const conv = await runDatingConversation(pA, pB, profA, profB);

  // Assert conversation structure
  assert.strictEqual(conv.status, 'completed');
  assert.strictEqual(conv.rounds, 4);
  assert.strictEqual(conv.turns.length, 8); // 4 rounds * 2 speakers
  assert.ok(conv.proposedActivity);
  assert.ok(conv.proposedActivity.activity.length > 5);
  assert.strictEqual(typeof conv.decisions.participantAContinue, 'boolean');
  assert.strictEqual(typeof conv.decisions.participantBContinue, 'boolean');

  // Verify persistence by reading from SQLite
  const loadedConv = await getConversationById(conv.id);
  assert.ok(loadedConv);
  assert.strictEqual(loadedConv.id, conv.id);
  assert.strictEqual(loadedConv.turns.length, 8);
  assert.strictEqual(loadedConv.turns[0].speakerId, pA.id);
  assert.ok(loadedConv.turns[0].supportingEvidenceUsed.length > 0);
});

test('runDatingConversation produces realistic decline decisions for mismatched participants', async () => {
  await initDatabase('file:./data/test_dating_platform.db');

  const pCasey: Participant = {
    id: `test-casey-${Date.now()}`,
    name: 'Casey Neistat',
    linkedinUrl: 'https://www.linkedin.com/in/caseyneistat',
    instagramUrl: 'https://www.instagram.com/caseyneistat',
    createdAt: new Date().toISOString(),
  };

  const pTimnit: Participant = {
    id: `test-timnit-${Date.now()}`,
    name: 'Timnit Gebru',
    linkedinUrl: 'https://www.linkedin.com/in/timnitgebru',
    instagramUrl: 'https://www.instagram.com/timnitgebru',
    createdAt: new Date().toISOString(),
  };

  await saveParticipant(pCasey);
  await saveParticipant(pTimnit);

  const [liCasey, igCasey] = await Promise.all([
    extractLinkedInProfile({ participantId: pCasey.id, url: pCasey.linkedinUrl, name: pCasey.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pCasey.id, url: pCasey.instagramUrl, name: pCasey.name, forceFixture: true }),
  ]);
  const profCasey = analyzeParticipantEvidence(pCasey, liCasey, igCasey);
  await saveAnalyzedProfile(profCasey);

  const [liTimnit, igTimnit] = await Promise.all([
    extractLinkedInProfile({ participantId: pTimnit.id, url: pTimnit.linkedinUrl, name: pTimnit.name, forceFixture: true }),
    extractInstagramProfile({ participantId: pTimnit.id, url: pTimnit.instagramUrl, name: pTimnit.name, forceFixture: true }),
  ]);
  const profTimnit = analyzeParticipantEvidence(pTimnit, liTimnit, igTimnit);
  await saveAnalyzedProfile(profTimnit);

  const conv = await runDatingConversation(pCasey, pTimnit, profCasey, profTimnit);

  assert.strictEqual(conv.status, 'completed');
  assert.strictEqual(conv.rounds, 4);
  assert.strictEqual(conv.turns.length, 8);

  // Mismatched interests and hobbies must produce decline decisions (continue === false)
  assert.strictEqual(conv.decisions.participantAContinue, false);
  assert.strictEqual(conv.decisions.participantBContinue, false);
  assert.strictEqual(conv.decisions.mutualMatch, false);
  assert.ok(conv.decisions.participantAReason.includes('virtually no overlap') || conv.decisions.participantAReason.includes('negligible overlap'));
  assert.ok(conv.decisions.participantBReason.includes('virtually no overlap') || conv.decisions.participantBReason.includes('negligible overlap'));

  // Proposed activity was declined
  if (conv.proposedActivity) {
    assert.strictEqual(conv.proposedActivity.acceptedByOther, false);
  }
});


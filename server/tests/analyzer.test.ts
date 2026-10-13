import test from 'node:test';
import assert from 'node:assert';
import { analyzeParticipantEvidence } from '../src/analysis/analyzer.js';
import { extractLinkedInProfile } from '../src/adapters/linkedin.adapter.js';
import { extractInstagramProfile } from '../src/adapters/instagram.adapter.js';
import { Participant } from '../src/types/index.js';

test('analyzeParticipantEvidence separates observed facts from hypotheses', async () => {
  const participant: Participant = {
    id: 'test-mkbhd',
    name: 'Marques Brownlee',
    linkedinUrl: 'https://www.linkedin.com/in/mkbhd',
    instagramUrl: 'https://www.instagram.com/mkbhd',
    createdAt: new Date().toISOString(),
  };

  const liEv = await extractLinkedInProfile({
    participantId: participant.id,
    url: participant.linkedinUrl,
    name: participant.name,
    forceFixture: true,
  });

  const igEv = await extractInstagramProfile({
    participantId: participant.id,
    url: participant.instagramUrl,
    name: participant.name,
    forceFixture: true,
  });

  const profile = analyzeParticipantEvidence(participant, liEv, igEv);

  // Facts must be backed by quotes or signals
  assert.ok(profile.observedFacts.length >= 2);
  assert.ok(profile.observedFacts.every((f) => f.quoteOrSignal.length > 0));

  // Hypotheses must have confidence and reasoning
  assert.ok(profile.hypotheses.length >= 2);
  assert.ok(profile.hypotheses.every((h) => ['HIGH', 'MEDIUM', 'LOW'].includes(h.confidence) && h.reasoning.length > 0));

  // Sensitive traits policy must be audited and enforced
  assert.strictEqual(profile.sensitiveTraitsPolicy.applied, true);
  assert.ok(profile.sensitiveTraitsPolicy.auditNote.includes('Religion, political stance'));

  // Missing information must be acknowledged
  assert.ok(profile.missingInformation.length > 0);

  // Relationship preference must not be hallucinated if unstated
  assert.strictEqual(profile.relationshipPreferences.evidenced, false);

  // Confidence level must be structured
  assert.ok(profile.confidence.score >= 0.5 && profile.confidence.score <= 1.0);
  assert.ok(['HIGH', 'MEDIUM', 'LOW'].includes(profile.confidence.overall));
});

import test from 'node:test';
import assert from 'node:assert';
import { extractLinkedInProfile } from '../src/adapters/linkedin.adapter.js';
import { extractInstagramProfile } from '../src/adapters/instagram.adapter.js';

test('extractLinkedInProfile captures source URL, status, timestamp and fields', async () => {
  const result = await extractLinkedInProfile({
    participantId: 'test-p1',
    url: 'https://www.linkedin.com/in/satyanadella',
    name: 'Satya Nadella',
    forceFixture: true,
  });

  assert.strictEqual(result.participantId, 'test-p1');
  assert.strictEqual(result.source, 'linkedin');
  assert.strictEqual(result.sourceUrl, 'https://www.linkedin.com/in/satyanadella');
  assert.strictEqual(result.status, 'fixture_snapshot');
  assert.ok(result.rawText.length > 20);
  assert.ok(result.extractedFields.headline);
  assert.ok(result.extractionTimestamp);
  assert.ok(result.latencyMs >= 0);
  assert.ok(result.notes.includes('Platform access controls'));
});

test('extractInstagramProfile captures public tags, content signals and latency', async () => {
  const result = await extractInstagramProfile({
    participantId: 'test-p1',
    url: 'https://www.instagram.com/satyanadella',
    name: 'Satya Nadella',
    forceFixture: true,
  });

  assert.strictEqual(result.participantId, 'test-p1');
  assert.strictEqual(result.source, 'instagram');
  assert.strictEqual(result.sourceUrl, 'https://www.instagram.com/satyanadella');
  assert.strictEqual(result.status, 'fixture_snapshot');
  assert.ok(result.extractedFields.recentTopics && result.extractedFields.recentTopics.length > 0);
  assert.ok(result.extractedFields.contentSignals);
});

test('adapter handles unknown profiles politely without crashing', async () => {
  const result = await extractLinkedInProfile({
    participantId: 'test-unknown',
    url: 'https://www.linkedin.com/in/unknown-person-xyz-12345',
    name: 'Unknown Person',
  });

  assert.strictEqual(result.participantId, 'test-unknown');
  assert.strictEqual(result.source, 'linkedin');
  assert.ok(['live_extracted', 'restricted_login_wall', 'rate_limited'].includes(result.status));
  assert.ok(result.notes.length > 0);
});

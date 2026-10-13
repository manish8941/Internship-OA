import test from 'node:test';
import assert from 'node:assert';
import { validateParticipantInput } from '../src/adapters/validator.js';

test('validateParticipantInput accepts valid LinkedIn and Instagram URLs', () => {
  const result = validateParticipantInput(
    'Satya Nadella',
    'https://www.linkedin.com/in/satyanadella',
    'https://www.instagram.com/satyanadella'
  );
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.linkedinUsername, 'satyanadella');
  assert.strictEqual(result.instagramUsername, 'satyanadella');
  assert.deepStrictEqual(result.errors, {});
});

test('validateParticipantInput normalizes URLs with trailing slashes or queries', () => {
  const result = validateParticipantInput(
    'Mira Murati',
    'https://linkedin.com/in/miramurati/?locale=en_US',
    'https://instagram.com/miramurati/'
  );
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.normalizedLinkedinUrl, 'https://www.linkedin.com/in/miramurati');
  assert.strictEqual(result.normalizedInstagramUrl, 'https://www.instagram.com/miramurati');
});

test('validateParticipantInput rejects missing or empty participant name', () => {
  const result = validateParticipantInput(
    '',
    'https://www.linkedin.com/in/satyanadella',
    'https://www.instagram.com/satyanadella'
  );
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.name);
});

test('validateParticipantInput rejects non-LinkedIn domain or invalid path', () => {
  const result = validateParticipantInput(
    'Alex Doe',
    'https://www.facebook.com/alexdoe',
    'https://www.instagram.com/alexdoe'
  );
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.linkedin);
});

test('validateParticipantInput rejects invalid Instagram URL and reserved paths', () => {
  const result = validateParticipantInput(
    'Alex Doe',
    'https://www.linkedin.com/in/alexdoe',
    'https://www.instagram.com/explore'
  );
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.instagram);
});

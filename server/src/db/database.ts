import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  Participant,
  ExtractionEvidence,
  AnalyzedProfile,
  DatingConversation,
  ConversationTurn,
  CompatibilityScore,
} from '../types/index.js';

dotenv.config();

function resolveDbPath(): string {
  if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
    return 'file:./data/test_dating_platform.db';
  }
  return process.env.DATABASE_URL || 'file:./data/dating_platform.db';
}

function ensureDbDirectory(dbUrl: string): void {
  if (dbUrl.startsWith('file:')) {
    const filePath = dbUrl.replace('file:', '');
    const dir = path.dirname(path.resolve(filePath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

let currentDbPath = resolveDbPath();
ensureDbDirectory(currentDbPath);

export let db: Client = createClient({
  url: currentDbPath,
});

export function switchDatabase(newUrl: string): void {
  ensureDbDirectory(newUrl);
  currentDbPath = newUrl;
  db = createClient({ url: newUrl });
}

export async function initDatabase(customUrl?: string): Promise<void> {
  if (customUrl && customUrl !== currentDbPath) {
    switchDatabase(customUrl);
  }
  await db.execute('PRAGMA foreign_keys = ON;');
  await db.execute('PRAGMA journal_mode = WAL;');
  await db.execute('PRAGMA busy_timeout = 5000;');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      linkedin_url TEXT NOT NULL,
      instagram_url TEXT NOT NULL,
      avatar_url TEXT,
      bio_headline TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS extraction_evidences (
      id TEXT PRIMARY KEY,
      participant_id TEXT NOT NULL,
      source TEXT NOT NULL,
      source_url TEXT NOT NULL,
      status TEXT NOT NULL,
      raw_text TEXT NOT NULL,
      extracted_fields_json TEXT NOT NULL,
      extraction_timestamp TEXT NOT NULL,
      latency_ms INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS analyzed_profiles (
      id TEXT PRIMARY KEY,
      participant_id TEXT NOT NULL UNIQUE,
      supported_interests_json TEXT NOT NULL,
      hobbies_json TEXT NOT NULL,
      lifestyle_signals_json TEXT NOT NULL,
      relationship_preferences_json TEXT NOT NULL,
      confidence_json TEXT NOT NULL,
      observed_facts_json TEXT NOT NULL,
      hypotheses_json TEXT NOT NULL,
      missing_information_json TEXT NOT NULL,
      sensitive_traits_policy_json TEXT NOT NULL,
      summary TEXT NOT NULL,
      analyzed_at TEXT NOT NULL,
      FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      participant_a_id TEXT NOT NULL,
      participant_b_id TEXT NOT NULL,
      status TEXT NOT NULL,
      rounds INTEGER NOT NULL,
      proposed_activity_json TEXT,
      decisions_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (participant_a_id) REFERENCES participants(id) ON DELETE CASCADE,
      FOREIGN KEY (participant_b_id) REFERENCES participants(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS conversation_turns (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      round_num INTEGER NOT NULL,
      speaker_id TEXT NOT NULL,
      speaker_name TEXT NOT NULL,
      message TEXT NOT NULL,
      supporting_evidence_json TEXT NOT NULL,
      topic TEXT NOT NULL,
      sentiment TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS compatibility_scores (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL UNIQUE,
      participant_a_id TEXT NOT NULL,
      participant_b_id TEXT NOT NULL,
      overall_score REAL NOT NULL,
      breakdown_json TEXT NOT NULL,
      shared_interests_json TEXT NOT NULL,
      complementary_points_json TEXT NOT NULL,
      potential_frictions_json TEXT NOT NULL,
      mutual_interest_indicator TEXT NOT NULL,
      explanation TEXT NOT NULL,
      evaluated_at TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `);
}

// ----------------- Repository Queries -----------------

export async function saveParticipant(p: Participant): Promise<void> {
  await db.execute({
    sql: `INSERT OR REPLACE INTO participants (id, name, linkedin_url, instagram_url, avatar_url, bio_headline, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [p.id, p.name, p.linkedinUrl, p.instagramUrl, p.avatarUrl || null, p.bioHeadline || null, p.createdAt],
  });
}

export async function getParticipants(): Promise<Participant[]> {
  const result = await db.execute('SELECT * FROM participants ORDER BY created_at DESC');
  return result.rows
    .filter((r: any) => {
      const id = String(r.id);
      return !id.startsWith('rank-test-') && !id.startsWith('rank-cand-') && !id.startsWith('rank-target-') && !id.startsWith('test-');
    })
    .map((r: any) => ({
      id: String(r.id),
      name: String(r.name),
      linkedinUrl: String(r.linkedin_url),
      instagramUrl: String(r.instagram_url),
      avatarUrl: r.avatar_url ? String(r.avatar_url) : undefined,
      bioHeadline: r.bio_headline ? String(r.bio_headline) : undefined,
      createdAt: String(r.created_at),
    }));
}

export async function getParticipantById(id: string): Promise<Participant | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM participants WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  const r: any = result.rows[0];
  return {
    id: String(r.id),
    name: String(r.name),
    linkedinUrl: String(r.linkedin_url),
    instagramUrl: String(r.instagram_url),
    avatarUrl: r.avatar_url ? String(r.avatar_url) : undefined,
    bioHeadline: r.bio_headline ? String(r.bio_headline) : undefined,
    createdAt: String(r.created_at),
  };
}

export async function saveExtractionEvidence(e: ExtractionEvidence): Promise<void> {
  await db.execute({
    sql: `INSERT OR REPLACE INTO extraction_evidences
          (id, participant_id, source, source_url, status, raw_text, extracted_fields_json, extraction_timestamp, latency_ms, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      e.id,
      e.participantId,
      e.source,
      e.sourceUrl,
      e.status,
      e.rawText,
      JSON.stringify(e.extractedFields),
      e.extractionTimestamp,
      e.latencyMs,
      e.notes || '',
    ],
  });
}

export async function getEvidencesByParticipantId(participantId: string): Promise<ExtractionEvidence[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM extraction_evidences WHERE participant_id = ? ORDER BY source ASC',
    args: [participantId],
  });
  return result.rows.map((r: any) => ({
    id: String(r.id),
    participantId: String(r.participant_id),
    source: r.source as 'linkedin' | 'instagram',
    sourceUrl: String(r.source_url),
    status: r.status as any,
    rawText: String(r.raw_text),
    extractedFields: JSON.parse(String(r.extracted_fields_json)),
    extractionTimestamp: String(r.extraction_timestamp),
    latencyMs: Number(r.latency_ms),
    notes: String(r.notes || ''),
  }));
}

export async function getAllEvidences(): Promise<ExtractionEvidence[]> {
  const result = await db.execute('SELECT * FROM extraction_evidences ORDER BY extraction_timestamp DESC');
  return result.rows.map((r: any) => ({
    id: String(r.id),
    participantId: String(r.participant_id),
    source: r.source as 'linkedin' | 'instagram',
    sourceUrl: String(r.source_url),
    status: r.status as any,
    rawText: String(r.raw_text),
    extractedFields: JSON.parse(String(r.extracted_fields_json)),
    extractionTimestamp: String(r.extraction_timestamp),
    latencyMs: Number(r.latency_ms),
    notes: String(r.notes || ''),
  }));
}

export async function saveAnalyzedProfile(p: AnalyzedProfile): Promise<void> {
  await db.execute({
    sql: `INSERT OR REPLACE INTO analyzed_profiles
          (id, participant_id, supported_interests_json, hobbies_json, lifestyle_signals_json,
           relationship_preferences_json, confidence_json, observed_facts_json, hypotheses_json,
           missing_information_json, sensitive_traits_policy_json, summary, analyzed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      p.id,
      p.participantId,
      JSON.stringify(p.supportedInterests),
      JSON.stringify(p.hobbies),
      JSON.stringify(p.lifestyleSignals),
      JSON.stringify(p.relationshipPreferences),
      JSON.stringify(p.confidence),
      JSON.stringify(p.observedFacts),
      JSON.stringify(p.hypotheses),
      JSON.stringify(p.missingInformation),
      JSON.stringify(p.sensitiveTraitsPolicy),
      p.summary,
      p.analyzedAt,
    ],
  });
}

export async function getAnalyzedProfileByParticipantId(participantId: string): Promise<AnalyzedProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM analyzed_profiles WHERE participant_id = ?',
    args: [participantId],
  });
  if (result.rows.length === 0) return null;
  const r: any = result.rows[0];
  return {
    id: String(r.id),
    participantId: String(r.participant_id),
    supportedInterests: JSON.parse(String(r.supported_interests_json)),
    hobbies: JSON.parse(String(r.hobbies_json)),
    lifestyleSignals: JSON.parse(String(r.lifestyle_signals_json)),
    relationshipPreferences: JSON.parse(String(r.relationship_preferences_json)),
    confidence: JSON.parse(String(r.confidence_json)),
    observedFacts: JSON.parse(String(r.observed_facts_json)),
    hypotheses: JSON.parse(String(r.hypotheses_json)),
    missingInformation: JSON.parse(String(r.missing_information_json)),
    sensitiveTraitsPolicy: JSON.parse(String(r.sensitive_traits_policy_json)),
    summary: String(r.summary),
    analyzedAt: String(r.analyzed_at),
  };
}

export async function getAllAnalyzedProfiles(): Promise<AnalyzedProfile[]> {
  const result = await db.execute('SELECT * FROM analyzed_profiles');
  return result.rows.map((r: any) => ({
    id: String(r.id),
    participantId: String(r.participant_id),
    supportedInterests: JSON.parse(String(r.supported_interests_json)),
    hobbies: JSON.parse(String(r.hobbies_json)),
    lifestyleSignals: JSON.parse(String(r.lifestyle_signals_json)),
    relationshipPreferences: JSON.parse(String(r.relationship_preferences_json)),
    confidence: JSON.parse(String(r.confidence_json)),
    observedFacts: JSON.parse(String(r.observed_facts_json)),
    hypotheses: JSON.parse(String(r.hypotheses_json)),
    missingInformation: JSON.parse(String(r.missing_information_json)),
    sensitiveTraitsPolicy: JSON.parse(String(r.sensitive_traits_policy_json)),
    summary: String(r.summary),
    analyzedAt: String(r.analyzed_at),
  }));
}

export async function saveConversation(conv: DatingConversation): Promise<void> {
  await db.execute({
    sql: `INSERT OR REPLACE INTO conversations
          (id, participant_a_id, participant_b_id, status, rounds, proposed_activity_json, decisions_json, created_at, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      conv.id,
      conv.participantAId,
      conv.participantBId,
      conv.status,
      conv.rounds,
      conv.proposedActivity ? JSON.stringify(conv.proposedActivity) : null,
      JSON.stringify(conv.decisions),
      conv.createdAt,
      conv.completedAt || null,
    ],
  });

  // Save conversation turns
  for (const turn of conv.turns) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO conversation_turns
            (id, conversation_id, round_num, speaker_id, speaker_name, message, supporting_evidence_json, topic, sentiment, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        turn.id,
        turn.conversationId,
        turn.round,
        turn.speakerId,
        turn.speakerName,
        turn.message,
        JSON.stringify(turn.supportingEvidenceUsed),
        turn.topic,
        turn.sentiment,
        turn.timestamp,
      ],
    });
  }
}

export async function getConversationById(id: string): Promise<DatingConversation | null> {
  const result = await db.execute({
    sql: `SELECT c.*, p1.name as p1_name, p2.name as p2_name
          FROM conversations c
          LEFT JOIN participants p1 ON c.participant_a_id = p1.id
          LEFT JOIN participants p2 ON c.participant_b_id = p2.id
          WHERE c.id = ?`,
    args: [id],
  });
  if (result.rows.length === 0) return null;
  const r: any = result.rows[0];

  const turnsResult = await db.execute({
    sql: 'SELECT * FROM conversation_turns WHERE conversation_id = ? ORDER BY round_num ASC, timestamp ASC',
    args: [id],
  });

  const turns: ConversationTurn[] = turnsResult.rows.map((t: any) => ({
    id: String(t.id),
    conversationId: String(t.conversation_id),
    round: Number(t.round_num),
    speakerId: String(t.speaker_id),
    speakerName: String(t.speaker_name),
    message: String(t.message),
    supportingEvidenceUsed: JSON.parse(String(t.supporting_evidence_json)),
    topic: String(t.topic),
    sentiment: t.sentiment as any,
    timestamp: String(t.timestamp),
  }));

  return {
    id: String(r.id),
    participantAId: String(r.participant_a_id),
    participantBId: String(r.participant_b_id),
    participantAName: String(r.p1_name || 'Participant A'),
    participantBName: String(r.p2_name || 'Participant B'),
    status: r.status as any,
    rounds: Number(r.rounds),
    turns,
    proposedActivity: r.proposed_activity_json ? JSON.parse(String(r.proposed_activity_json)) : null,
    decisions: JSON.parse(String(r.decisions_json)),
    createdAt: String(r.created_at),
    completedAt: r.completed_at ? String(r.completed_at) : undefined,
  };
}

export async function getConversationsByParticipant(participantId: string): Promise<DatingConversation[]> {
  const result = await db.execute({
    sql: `SELECT id FROM conversations
          WHERE participant_a_id = ? OR participant_b_id = ?
          ORDER BY created_at DESC`,
    args: [participantId, participantId],
  });
  const convs: DatingConversation[] = [];
  for (const row of result.rows) {
    const c = await getConversationById(String(row.id));
    if (c) convs.push(c);
  }
  return convs;
}

export async function getAllConversations(): Promise<DatingConversation[]> {
  const result = await db.execute('SELECT id FROM conversations ORDER BY created_at DESC');
  const convs: DatingConversation[] = [];
  for (const row of result.rows) {
    const c = await getConversationById(String(row.id));
    if (c) {
      if (
        !c.participantAId.startsWith('rank-') &&
        !c.participantAId.startsWith('test-') &&
        !c.participantBId.startsWith('rank-') &&
        !c.participantBId.startsWith('test-')
      ) {
        convs.push(c);
      }
    }
  }
  return convs;
}

export async function saveCompatibilityScore(score: CompatibilityScore): Promise<void> {
  await db.execute({
    sql: `INSERT OR REPLACE INTO compatibility_scores
          (id, conversation_id, participant_a_id, participant_b_id, overall_score, breakdown_json,
           shared_interests_json, complementary_points_json, potential_frictions_json,
           mutual_interest_indicator, explanation, evaluated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      score.id,
      score.conversationId,
      score.participantAId,
      score.participantBId,
      score.overallScore,
      JSON.stringify(score.breakdown),
      JSON.stringify(score.sharedInterests),
      JSON.stringify(score.complementaryPoints),
      JSON.stringify(score.potentialFrictions),
      score.mutualInterestIndicator,
      score.explanation,
      score.evaluatedAt,
    ],
  });
}

export async function getCompatibilityScoresForParticipant(participantId: string): Promise<CompatibilityScore[]> {
  const result = await db.execute({
    sql: `SELECT * FROM compatibility_scores
          WHERE participant_a_id = ? OR participant_b_id = ?
          ORDER BY overall_score DESC`,
    args: [participantId, participantId],
  });
  return result.rows.map((r: any) => ({
    id: String(r.id),
    conversationId: String(r.conversation_id),
    participantAId: String(r.participant_a_id),
    participantBId: String(r.participant_b_id),
    overallScore: Number(r.overall_score),
    breakdown: JSON.parse(String(r.breakdown_json)),
    sharedInterests: JSON.parse(String(r.shared_interests_json)),
    complementaryPoints: JSON.parse(String(r.complementary_points_json)),
    potentialFrictions: JSON.parse(String(r.potential_frictions_json)),
    mutualInterestIndicator: r.mutual_interest_indicator as any,
    explanation: String(r.explanation),
    evaluatedAt: String(r.evaluated_at),
  }));
}

export async function clearAllData(): Promise<void> {
  await db.execute('DELETE FROM compatibility_scores;');
  await db.execute('DELETE FROM conversation_turns;');
  await db.execute('DELETE FROM conversations;');
  await db.execute('DELETE FROM analyzed_profiles;');
  await db.execute('DELETE FROM extraction_evidences;');
  await db.execute('DELETE FROM participants;');
}

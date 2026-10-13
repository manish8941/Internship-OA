import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import {
  initDatabase,
  getParticipants,
  getParticipantById,
  saveParticipant,
  getEvidencesByParticipantId,
  getAllEvidences,
  saveExtractionEvidence,
  getAnalyzedProfileByParticipantId,
  getAllAnalyzedProfiles,
  saveAnalyzedProfile,
  getAllConversations,
  getConversationById,
  getConversationsByParticipant,
} from './db/database.js';
import { validateParticipantInput } from './adapters/validator.js';
import { extractLinkedInProfile } from './adapters/linkedin.adapter.js';
import { extractInstagramProfile } from './adapters/instagram.adapter.js';
import { analyzeParticipantEvidence } from './analysis/analyzer.js';
import { runDatingConversation } from './dating/harness.js';
import { DatingSimulator } from './dating/simulator.js';
import { generatePersonalizedRanking } from './ranking/ranker.js';
import { seedDemoDataset } from './db/seed.js';
import { llmService } from './analysis/llm.service.js';
import { Participant } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB and Auto-seed demo participants if empty
async function bootstrap() {
  await initDatabase();
  const existing = await getParticipants();
  if (existing.length === 0) {
    console.log('Database empty on startup. Auto-seeding 25 demo participants...');
    await seedDemoDataset(false);
  }
}

// ----------------- API Endpoints -----------------

// Health & System Info
app.get('/api/health', async (req: Request, res: Response) => {
  const ollamaOk = await llmService.checkAvailability();
  res.json({
    status: 'ok',
    version: '1.0.0',
    llmProvider: ollamaOk ? 'Ollama (Local LLM Active)' : 'Deterministic Offline Reasoning Engine (Active)',
    useOllamaConfig: process.env.USE_OLLAMA === 'true',
    timestamp: new Date().toISOString(),
  });
});

// Ingest New Participant
app.post('/api/participants', async (req: Request, res: Response) => {
  try {
    const { name, linkedinUrl, instagramUrl } = req.body;

    const validation = validateParticipantInput(name, linkedinUrl, instagramUrl);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const participantId = `part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newParticipant: Participant = {
      id: participantId,
      name: name.trim(),
      linkedinUrl: validation.normalizedLinkedinUrl || linkedinUrl.trim(),
      instagramUrl: validation.normalizedInstagramUrl || instagramUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save initial participant record
    await saveParticipant(newParticipant);

    // Extract dual source evidence through separate adapters
    const [linkedinEvidence, instagramEvidence] = await Promise.all([
      extractLinkedInProfile({
        participantId,
        url: newParticipant.linkedinUrl,
        name: newParticipant.name,
      }),
      extractInstagramProfile({
        participantId,
        url: newParticipant.instagramUrl,
        name: newParticipant.name,
      }),
    ]);

    await saveExtractionEvidence(linkedinEvidence);
    await saveExtractionEvidence(instagramEvidence);

    // Analyze evidence into structured profile
    const profile = analyzeParticipantEvidence(newParticipant, linkedinEvidence, instagramEvidence);
    await saveAnalyzedProfile(profile);

    // Auto-run 2 dates with existing participants so new participant has initial rankings!
    const allParticipants = await getParticipants();
    const otherCandidates = allParticipants.filter((p) => p.id !== participantId).slice(0, 2);

    for (const cand of otherCandidates) {
      const candProfile = await getAnalyzedProfileByParticipantId(cand.id);
      if (candProfile) {
        await runDatingConversation(newParticipant, cand, profile, candProfile);
      }
    }

    res.status(201).json({
      success: true,
      participant: newParticipant,
      profile,
      evidences: [linkedinEvidence, instagramEvidence],
    });
  } catch (err: any) {
    console.error('Participant ingestion failed:', err);
    res.status(500).json({ error: 'Server error processing participant', message: err.message });
  }
});

// List Participants
app.get('/api/participants', async (req: Request, res: Response) => {
  try {
    const participants = await getParticipants();
    res.json(participants);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve participants', message: err.message });
  }
});

// Get Participant Details
app.get('/api/participants/:id', async (req: Request, res: Response) => {
  try {
    const participant = await getParticipantById(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    const profile = await getAnalyzedProfileByParticipantId(participant.id);
    const evidences = await getEvidencesByParticipantId(participant.id);
    const conversations = await getConversationsByParticipant(participant.id);

    res.json({
      participant,
      profile,
      evidences,
      conversations,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve participant', message: err.message });
  }
});

// Personalized Rankings for a Participant
app.get('/api/participants/:id/rankings', async (req: Request, res: Response) => {
  try {
    const rankings = await generatePersonalizedRanking(req.params.id);
    if (!rankings) {
      return res.status(404).json({ error: 'Participant not found or no dating history' });
    }
    res.json(rankings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate personalized rankings', message: err.message });
  }
});

// Conversations List
app.get('/api/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await getAllConversations();
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve conversations', message: err.message });
  }
});

// Conversation Detail
app.get('/api/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve conversation', message: err.message });
  }
});

// Start Date between Two Participants
app.post('/api/dating/start', async (req: Request, res: Response) => {
  try {
    const { participantAId, participantBId } = req.body;
    if (!participantAId || !participantBId || participantAId === participantBId) {
      return res.status(400).json({ error: 'Must specify two distinct participant IDs' });
    }

    const pA = await getParticipantById(participantAId);
    const pB = await getParticipantById(participantBId);
    if (!pA || !pB) {
      return res.status(404).json({ error: 'One or both participants could not be found' });
    }

    const profA = await getAnalyzedProfileByParticipantId(participantAId);
    const profB = await getAnalyzedProfileByParticipantId(participantBId);
    if (!profA || !profB) {
      return res.status(400).json({ error: 'Profiles must be analyzed before dating' });
    }

    const conversation = await runDatingConversation(pA, pB, profA, profB);
    res.json({ success: true, conversation });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to run dating conversation', message: err.message });
  }
});

// Real-Time Dating Simulation SSE Stream
app.get('/api/dating/live-stream', async (req: Request, res: Response) => {
  const { participantAId, participantBId, speedMultiplier } = req.query;

  if (!participantAId || !participantBId || typeof participantAId !== 'string' || typeof participantBId !== 'string') {
    return res.status(400).json({ error: 'Missing participant IDs' });
  }

  const speed = Number(speedMultiplier) || 1;
  const delayMs = Math.max(300, Math.round(1000 / speed));

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  await DatingSimulator.streamLiveDate(participantAId, participantBId, delayMs, res);
});

// Extraction Evidences & Compliance Audit
app.get('/api/evidences', async (req: Request, res: Response) => {
  try {
    const evidences = await getAllEvidences();
    res.json(evidences);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve extraction evidences', message: err.message });
  }
});

// Demo Data Control: Reset / Re-seed
app.post('/api/demo/seed', async (req: Request, res: Response) => {
  try {
    const forceClear = req.body?.forceClear === true;
    const result = await seedDemoDataset(forceClear);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to seed demo data', message: err.message });
  }
});

// Demo Data Control: Simulate All Pairs
app.post('/api/demo/simulate-all', async (req: Request, res: Response) => {
  try {
    const participants = await getParticipants();
    const profiles = await getAllAnalyzedProfiles();
    const map = new Map<string, any>();
    profiles.forEach((p) => map.set(p.participantId, p));

    const count = await DatingSimulator.runBatchDates(participants, map, 2);
    res.json({ success: true, newConversationsCount: count });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to simulate batch dates', message: err.message });
  }
});

// Serve compiled frontend in production if built
const distPath = path.resolve('dist/client');
app.use(express.static(distPath));
app.get('*', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) res.status(404).send('Not Found');
    });
  }
});

bootstrap().then(() => {
  app.listen(PORT, () => {
    console.log(`✨ Agentic Dating Backend running on http://localhost:${PORT}`);
  });
});

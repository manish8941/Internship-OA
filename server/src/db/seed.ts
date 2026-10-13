import { initDatabase, saveParticipant, saveExtractionEvidence, saveAnalyzedProfile, getParticipants, clearAllData } from './database.js';
import { VERIFIED_FIXTURES } from '../adapters/fixtures.js';
import { extractLinkedInProfile } from '../adapters/linkedin.adapter.js';
import { extractInstagramProfile } from '../adapters/instagram.adapter.js';
import { analyzeParticipantEvidence } from '../analysis/analyzer.js';
import { DatingSimulator } from '../dating/simulator.js';
import { Participant, AnalyzedProfile } from '../types/index.js';

export async function seedDemoDataset(forceClear: boolean = false): Promise<{ participantsCount: number; conversationsCount: number }> {
  await initDatabase();

  if (forceClear) {
    await clearAllData();
  } else {
    const existing = await getParticipants();
    if (existing.length >= 25) {
      console.log(`Database already populated with ${existing.length} participants.`);
      return { participantsCount: existing.length, conversationsCount: 0 };
    }
  }

  console.log('Seeding 25 verified public participants...');

  const fixtureKeys = Object.keys(VERIFIED_FIXTURES);
  const createdParticipants: Participant[] = [];
  const profilesMap = new Map<string, AnalyzedProfile>();

  for (let i = 0; i < fixtureKeys.length; i++) {
    const key = fixtureKeys[i];
    const fix = VERIFIED_FIXTURES[key];

    const participant: Participant = {
      id: `part-${key}`,
      name: fix.name,
      linkedinUrl: `https://www.linkedin.com/in/${fix.linkedinUsername}`,
      instagramUrl: `https://www.instagram.com/${fix.instagramUsername}`,
      avatarUrl: fix.avatarUrl,
      bioHeadline: fix.bioHeadline,
      createdAt: new Date(Date.now() - (25 - i) * 3600000).toISOString(),
    };

    await saveParticipant(participant);
    createdParticipants.push(participant);

    // Extract LinkedIn Evidence (honest fixture snapshot)
    const liEv = await extractLinkedInProfile({
      participantId: participant.id,
      url: participant.linkedinUrl,
      name: participant.name,
      forceFixture: true,
    });
    await saveExtractionEvidence(liEv);

    // Extract Instagram Evidence (honest fixture snapshot)
    const igEv = await extractInstagramProfile({
      participantId: participant.id,
      url: participant.instagramUrl,
      name: participant.name,
      forceFixture: true,
    });
    await saveExtractionEvidence(igEv);

    // Analyze Evidence into Structured Profile
    const profile = analyzeParticipantEvidence(participant, liEv, igEv);
    await saveAnalyzedProfile(profile);
    profilesMap.set(participant.id, profile);
  }

  console.log(`Seeded ${createdParticipants.length} participants with analyzed profiles.`);
  console.log('Running initial multi-turn dating harness across participant pairs...');

  // Run dating conversations between participants (3 dates per participant)
  const createdConvs = await DatingSimulator.runBatchDates(createdParticipants, profilesMap, 3);
  console.log(`Successfully generated and persisted ${createdConvs} dating conversations and compatibility scores!`);

  return {
    participantsCount: createdParticipants.length,
    conversationsCount: createdConvs,
  };
}

// Allow direct CLI execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('seed.ts')) {
  const force = process.argv.includes('--force') || process.argv.includes('-f');
  seedDemoDataset(force)
    .then((res) => {
      console.log('Demo seed completed successfully:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

import {
  AnalyzedProfile,
  DatingConversation,
  CompatibilityScore,
  MutualInterestIndicator,
  PersonalizedRanking,
  RankedCandidate,
  Participant,
} from '../types/index.js';
import {
  getCompatibilityScoresForParticipant,
  getParticipantById,
  getAnalyzedProfileByParticipantId,
  getConversationById,
  saveCompatibilityScore,
} from '../db/database.js';
import { hasConceptualOverlap } from '../dating/agent.js';

export function evaluateCompatibility(
  conv: DatingConversation,
  profileA: AnalyzedProfile,
  profileB: AnalyzedProfile
): CompatibilityScore {
  // 1. Shared Interests Score (Max 30)
  const sharedInterests: string[] = [];
  profileA.supportedInterests.forEach((ia) => {
    const match = profileB.supportedInterests.find((ib) => hasConceptualOverlap(ia, ib));
    if (match && !sharedInterests.includes(match)) {
      sharedInterests.push(match);
    }
  });

  const sharedInterestsScore = Math.min(30, Math.round(sharedInterests.length * 10 + (sharedInterests.length > 0 ? 5 : 0)));

  // 2. Preference Alignment Score (Max 25)
  let preferenceAlignmentScore = 12; // baseline mutual civility
  const commonHobbies = profileA.hobbies.filter((ha) =>
    profileB.hobbies.some((hb) => hasConceptualOverlap(ha, hb))
  );
  if (commonHobbies.length > 0) preferenceAlignmentScore += 7;

  // Check lifestyle harmony
  const athleteA = profileA.lifestyleSignals.some((s) => s.toLowerCase().includes('athlete') || s.toLowerCase().includes('running'));
  const athleteB = profileB.lifestyleSignals.some((s) => s.toLowerCase().includes('athlete') || s.toLowerCase().includes('running'));
  if (athleteA && athleteB) preferenceAlignmentScore += 4;

  const caffeineA = profileA.lifestyleSignals.some((s) => s.toLowerCase().includes('coffee') || s.toLowerCase().includes('caffeine'));
  const caffeineB = profileB.lifestyleSignals.some((s) => s.toLowerCase().includes('coffee') || s.toLowerCase().includes('caffeine'));
  if (caffeineA && caffeineB) preferenceAlignmentScore += 2;

  preferenceAlignmentScore = Math.min(25, preferenceAlignmentScore);

  // 3. Complementary Goals Score (Max 20)
  let complementaryGoalsScore = 10;
  const complementaryPoints: string[] = [];

  const techA = profileA.supportedInterests.some((i) => i.toLowerCase().includes('tech') || i.toLowerCase().includes('ai') || i.toLowerCase().includes('systems'));
  const creativeB = profileB.supportedInterests.some((i) => i.toLowerCase().includes('creator') || i.toLowerCase().includes('design') || i.toLowerCase().includes('art') || i.toLowerCase().includes('video'));

  if (techA && creativeB) {
    complementaryGoalsScore += 7;
    complementaryPoints.push('High synergy between technical depth and creative storytelling/design execution.');
  } else if (techA && !creativeB) {
    complementaryGoalsScore += 5;
    complementaryPoints.push('Shared resonance around engineering rigor, systems thinking, and autonomous building.');
  } else {
    complementaryPoints.push('Harmonious appreciation for independent craftsmanship and creative autonomy.');
  }

  // 4. Conversation Quality Score (Max 15)
  let conversationQualityScore = 5;
  if (conv.turns.length >= 6) conversationQualityScore += 3;
  if (conv.proposedActivity && conv.proposedActivity.acceptedByOther) conversationQualityScore += 4;
  if (conv.decisions.participantAContinue && conv.decisions.participantBContinue) conversationQualityScore += 3;
  conversationQualityScore = Math.min(15, conversationQualityScore);

  // 5. Data Confidence Score (Max 10)
  const avgConfidence = (profileA.confidence.score + profileB.confidence.score) / 2;
  const dataConfidenceScore = Math.round(avgConfidence * 10);

  const overallScore = Math.min(
    100,
    Math.round(
      sharedInterestsScore +
        preferenceAlignmentScore +
        complementaryGoalsScore +
        conversationQualityScore +
        dataConfidenceScore
    )
  );

  // Mutual Interest Indicator
  let mutualInterestIndicator: MutualInterestIndicator = 'POLITE_ACQUAINTANCE';
  if (conv.decisions.participantAContinue && conv.decisions.participantBContinue) {
    if (overallScore >= 70) {
      mutualInterestIndicator = 'MUTUAL_MATCH';
    } else {
      mutualInterestIndicator = 'POLITE_ACQUAINTANCE';
    }
  } else if (conv.decisions.participantAContinue || conv.decisions.participantBContinue) {
    mutualInterestIndicator = 'ONE_WAY_INTEREST';
  } else {
    mutualInterestIndicator = 'INCOMPATIBLE';
  }

  // Potential Frictions (Honest, non-fabricated observations)
  const potentialFrictions: string[] = [];
  if (sharedInterests.length === 0) {
    potentialFrictions.push('Limited direct domain overlap in public interests; connection depends heavily on interpersonal chemistry.');
  }
  if (profileA.confidence.overall === 'LOW' || profileB.confidence.overall === 'LOW') {
    potentialFrictions.push('Partial public profile evidence; personal boundaries and day-to-day rhythm require live exploration.');
  }

  // Qualitative explanation
  let explanation = '';
  if (mutualInterestIndicator === 'MUTUAL_MATCH') {
    explanation = `High mutual synergy (${overallScore}/100). Both agents enthusiastically agreed to continue. Anchored by shared curiosity in ${sharedInterests.slice(0, 2).join(' and ') || 'creative innovation'}, aligned active lifestyles, and immediate acceptance of the proposed meetup.`;
  } else if (mutualInterestIndicator === 'POLITE_ACQUAINTANCE') {
    explanation = `Courteous, cordial exchange (${overallScore}/100). While both participants demonstrated mutual respect, domain interests diverge and deeper personal alignment remains unverified in public sources.`;
  } else if (mutualInterestIndicator === 'ONE_WAY_INTEREST') {
    explanation = `Asymmetric connection (${overallScore}/100). One participant showed strong interest in continuing while the other favored professional acquaintanceship.`;
  } else {
    explanation = `Lower compatibility (${overallScore}/100). Differing priorities and minimal overlap in evidenced lifestyle rituals.`;
  }

  return {
    id: `comp-${conv.id}`,
    conversationId: conv.id,
    participantAId: conv.participantAId,
    participantBId: conv.participantBId,
    overallScore,
    breakdown: {
      sharedInterestsScore,
      preferenceAlignmentScore,
      complementaryGoalsScore,
      conversationQualityScore,
      dataConfidenceScore,
    },
    sharedInterests,
    complementaryPoints,
    potentialFrictions,
    mutualInterestIndicator,
    explanation,
    evaluatedAt: new Date().toISOString(),
  };
}

export async function generatePersonalizedRanking(participantId: string): Promise<PersonalizedRanking | null> {
  const target = await getParticipantById(participantId);
  if (!target) return null;

  const rawScores = await getCompatibilityScoresForParticipant(participantId);
  const rankedCandidates: RankedCandidate[] = [];

  for (const score of rawScores) {
    const candidateId = score.participantAId === participantId ? score.participantBId : score.participantAId;
    const candidate = await getParticipantById(candidateId);
    if (!candidate) continue;

    const conv = await getConversationById(score.conversationId);
    const bothContinued = conv ? conv.decisions.participantAContinue && conv.decisions.participantBContinue : false;
    const proposedActivity = conv ? conv.proposedActivity : null;

    rankedCandidates.push({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateAvatarUrl: candidate.avatarUrl,
      candidateHeadline: candidate.bioHeadline,
      overallScore: score.overallScore,
      breakdown: score.breakdown,
      mutualInterestIndicator: score.mutualInterestIndicator,
      sharedInterests: score.sharedInterests,
      topComplementaryPoint: score.complementaryPoints[0] || 'Complementary lifestyle rhythms',
      conversationId: score.conversationId,
      proposedActivity,
      bothContinued,
      explanation: score.explanation,
    });
  }

  // Sort descending by overall score
  rankedCandidates.sort((a, b) => b.overallScore - a.overallScore);

  return {
    targetParticipant: target,
    rankedCandidates,
    totalCandidatesDated: rankedCandidates.length,
    generatedAt: new Date().toISOString(),
  };
}

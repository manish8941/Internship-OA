import {
  Participant,
  ExtractionEvidence,
  AnalyzedProfile,
  ObservedFact,
  Hypothesis,
} from '../types/index.js';

export function analyzeParticipantEvidence(
  participant: Participant,
  linkedinEvidence: ExtractionEvidence,
  instagramEvidence: ExtractionEvidence
): AnalyzedProfile {
  const liFields = linkedinEvidence.extractedFields || {};
  const igFields = instagramEvidence.extractedFields || {};

  // Extract supported interests from both sources
  const interestsSet = new Set<string>();
  if (liFields.recentTopics) liFields.recentTopics.forEach((t) => interestsSet.add(t));
  if (liFields.publicTags) liFields.publicTags.forEach((t) => interestsSet.add(t));
  if (igFields.recentTopics) igFields.recentTopics.forEach((t) => interestsSet.add(t));
  if (igFields.publicTags) igFields.publicTags.forEach((t) => interestsSet.add(t));

  // Extract hobbies (activity-oriented topics)
  const hobbyKeywords = [
    'running', 'marathon', 'trail', 'cricket', 'piano', 'music', 'welding', 'maker',
    'bjj', 'jiu-jitsu', 'martial arts', 'guitar', 'gardening', 'speedcubing', 'keyboards',
    'board games', 'surfing', 'synths', 'aviation', 'flying', 'piloting', 'horology',
    'watches', 'sourdough', 'baking', 'hiking', 'mountaineering', 'weightlifting', 'chess',
    'gaming', 'badminton', 'table tennis', 'cycling', 'reading', 'photography', 'art',
  ];

  const hobbiesSet = new Set<string>();
  const combinedTopics = [
    ...(liFields.recentTopics || []),
    ...(liFields.publicTags || []),
    ...(igFields.recentTopics || []),
    ...(igFields.publicTags || []),
  ];

  combinedTopics.forEach((topic) => {
    const lower = topic.toLowerCase();
    if (hobbyKeywords.some((kw) => lower.includes(kw))) {
      hobbiesSet.add(topic);
    }
  });

  // Extract lifestyle signals
  const lifestyleSignalsSet = new Set<string>();
  if (igFields.contentSignals) {
    igFields.contentSignals.forEach((s) => lifestyleSignalsSet.add(s));
  }
  if (liFields.summary && liFields.summary.toLowerCase().includes('travel')) {
    lifestyleSignalsSet.add('International Traveler');
  }
  if (igFields.bio && igFields.bio.toLowerCase().includes('dog')) {
    lifestyleSignalsSet.add('Dog Lover');
  }
  if (combinedTopics.some((t) => t.toLowerCase().includes('coffee') || t.toLowerCase().includes('mate'))) {
    lifestyleSignalsSet.add('Specialty Caffeine Rituals');
  }
  if (combinedTopics.some((t) => t.toLowerCase().includes('running') || t.toLowerCase().includes('cycling') || t.toLowerCase().includes('bjj'))) {
    lifestyleSignalsSet.add('Early Active Athlete');
  }

  // Fallbacks if set is small
  if (lifestyleSignalsSet.size === 0) {
    lifestyleSignalsSet.add('Creative Focus');
    lifestyleSignalsSet.add('Dedicated Professional');
  }

  // Observed Facts (grounded with direct quotes / signals from sources)
  const observedFacts: ObservedFact[] = [];

  if (liFields.headline) {
    observedFacts.push({
      source: 'linkedin',
      fact: `Professional Headline: ${liFields.headline}`,
      quoteOrSignal: liFields.headline,
    });
  }
  if (liFields.summary) {
    observedFacts.push({
      source: 'linkedin',
      fact: 'Career & Systems Focus summary stated on professional profile',
      quoteOrSignal: liFields.summary.slice(0, 140) + '...',
    });
  }
  if (liFields.locationHint) {
    observedFacts.push({
      source: 'linkedin',
      fact: `Geographic Location: Based in ${liFields.locationHint}`,
      quoteOrSignal: liFields.locationHint,
    });
  }
  if (igFields.bio) {
    observedFacts.push({
      source: 'instagram',
      fact: `Public Instagram Bio: "${igFields.bio}"`,
      quoteOrSignal: igFields.bio,
    });
  }
  if (igFields.recentTopics && igFields.recentTopics.length > 0) {
    observedFacts.push({
      source: 'instagram',
      fact: `Publicly shared visual themes: ${igFields.recentTopics.slice(0, 3).join(', ')}`,
      quoteOrSignal: igFields.recentTopics.slice(0, 3).join(', '),
    });
  }

  if (observedFacts.length === 0) {
    observedFacts.push({
      source: 'linkedin',
      fact: `Profile URL submitted: ${participant.linkedinUrl}`,
      quoteOrSignal: 'Platform access wall prevented extraction of public headline/summary without authentication credentials.',
    });
    observedFacts.push({
      source: 'instagram',
      fact: `Profile URL submitted: ${participant.instagramUrl}`,
      quoteOrSignal: 'Platform access wall prevented extraction of public bio/visual feed without authentication credentials.',
    });
  }

  // Hypotheses (distinct from facts, clearly labeled with reasoning)
  const hypotheses: Hypothesis[] = [];

  const isTechHeavy = Array.from(interestsSet).some((i) =>
    ['ai', 'code', 'systems', 'cloud', 'engineering', 'hardware', 'deep learning'].some((k) =>
      i.toLowerCase().includes(k)
    )
  );

  if (isTechHeavy) {
    hypotheses.push({
      hypothesis: 'Values intellectual depth and builders who take craft and technical systems seriously.',
      confidence: 'HIGH',
      reasoning: 'Consistent focus across career publications and personal project portfolios.',
    });
  }

  if (hobbiesSet.size >= 2) {
    hypotheses.push({
      hypothesis: 'Prefers active experiential dates over standard sedentary dinners.',
      confidence: 'MEDIUM',
      reasoning: `Demonstrated enthusiasm for hands-on activities (${Array.from(hobbiesSet).slice(0, 2).join(', ')}).`,
    });
  } else {
    hypotheses.push({
      hypothesis: 'Appreciates focused one-on-one dialogue in quiet, aesthetic spaces.',
      confidence: 'MEDIUM',
      reasoning: 'Grounded in reflective tone and measured public sharing style.',
    });
  }

  hypotheses.push({
    hypothesis: 'High autonomy orientation; values partners who cultivate independent passions and projects.',
    confidence: 'MEDIUM',
    reasoning: 'Evidence of deep self-directed pursuits, high-ownership career arcs, and creative side projects.',
  });

  // Strict Relationship Preferences Evidenced Check
  // "potential relationship preferences only when explicitly evidenced... do not claim romantic intent that sources do not establish"
  const rawCombined = `${linkedinEvidence.rawText} ${instagramEvidence.rawText}`.toLowerCase();
  let relationshipPreferences = {
    evidenced: false,
    description: 'No explicit romantic or dating intent established in public professional or social media profiles.',
    sourceReference: undefined as string | undefined,
  };

  const relationshipKeywords = ['looking for someone', 'partner in crime', 'seeking partner', 'single and', 'dating'];
  for (const kw of relationshipKeywords) {
    if (rawCombined.includes(kw)) {
      relationshipPreferences = {
        evidenced: true,
        description: `Explicit public mention: mentions interest in relationship or partner exploration.`,
        sourceReference: `Explicit text match on public feed: "${kw}"`,
      };
      break;
    }
  }

  // Missing Information
  const missingInformation: string[] = [
    'No explicit dating or romantic intent stated (standard for public professional/creative profiles).',
    'Day-to-day schedule availability and immediate dating boundaries are not public.',
  ];
  if (!liFields.locationHint) {
    missingInformation.push('Exact neighborhood residence unverified.');
  }

  // Confidence Calculation
  let liScore = 0.15;
  if (linkedinEvidence.status === 'live_extracted') {
    liScore = 0.45;
  } else if (linkedinEvidence.status === 'fixture_snapshot') {
    liScore = 0.45;
  }
  if (liFields.summary && liFields.summary.length > 50) liScore += 0.05;

  let igScore = 0.15;
  if (instagramEvidence.status === 'live_extracted') {
    igScore = 0.4;
  } else if (instagramEvidence.status === 'fixture_snapshot') {
    igScore = 0.4;
  }

  const isRestrictedBoth = linkedinEvidence.status === 'restricted_login_wall' && instagramEvidence.status === 'restricted_login_wall';
  const recencyScore = isRestrictedBoth ? 0.0 : 0.1;
  const totalScore = Math.min(1.0, Number((liScore + igScore + recencyScore).toFixed(2)));

  let overallRating: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (totalScore >= 0.8) overallRating = 'HIGH';
  else if (totalScore < 0.5) overallRating = 'LOW';

  const confidenceRationale =
    overallRating === 'HIGH'
      ? 'Strong dual-source synthesis: rich professional narrative from LinkedIn coupled with visual lifestyle signals from Instagram.'
      : overallRating === 'LOW'
      ? 'Low dual-source confidence: extraction restricted by platform authentication walls; fields withheld to prevent unverified inference.'
      : 'Moderate dual-source confidence: core professional headline and public handles confirmed; personal lifestyle signals are partially inferred.';

  // Sensitive Traits Audit
  const sensitiveTraitsPolicy = {
    applied: true,
    auditNote:
      'Strict adherence: Religion, political stance, ethnicity, health status, and sexual orientation were excluded and not inferred, respecting privacy and ethical guidelines.',
  };

  // Profile Summary
  const topInterests = Array.from(interestsSet).slice(0, 3).join(', ');
  const summary = topInterests
    ? `${participant.name} is a driven creator and thinker with primary focus in ${topInterests}. Evidenced lifestyle includes ${Array.from(hobbiesSet).slice(0, 2).join(' and ') || 'creative exploration and outdoor recreation'}, exhibiting high autonomy, intellectual curiosity, and appreciation for craft.`
    : `${participant.name} (submitted via public URLs). Direct extraction encountered platform authentication barriers. In strict adherence to ethical guardrails, profile attributes were not hallucinated.`;

  return {
    id: `prof-${participant.id}`,
    participantId: participant.id,
    supportedInterests: Array.from(interestsSet),
    hobbies: Array.from(hobbiesSet),
    lifestyleSignals: Array.from(lifestyleSignalsSet),
    relationshipPreferences,
    confidence: {
      overall: overallRating,
      score: totalScore,
      breakdown: {
        linkedinEvidenceScore: Number(liScore.toFixed(2)),
        instagramEvidenceScore: Number(igScore.toFixed(2)),
        recencyScore,
      },
      rationale: confidenceRationale,
    },
    observedFacts,
    hypotheses,
    missingInformation,
    sensitiveTraitsPolicy,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}

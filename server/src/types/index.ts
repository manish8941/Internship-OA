export interface Participant {
  id: string;
  name: string;
  linkedinUrl: string;
  instagramUrl: string;
  avatarUrl?: string;
  bioHeadline?: string;
  createdAt: string;
}

export type ExtractionStatus =
  | 'live_extracted'
  | 'restricted_login_wall'
  | 'fixture_snapshot'
  | 'rate_limited'
  | 'failed';

export interface ExtractedFields {
  headline?: string;
  bio?: string;
  summary?: string;
  recentTopics?: string[];
  publicTags?: string[];
  experienceHighlights?: string[];
  contentSignals?: string[];
  locationHint?: string;
  followersCountApprox?: string;
}

export interface ExtractionEvidence {
  id: string;
  participantId: string;
  source: 'linkedin' | 'instagram';
  sourceUrl: string;
  status: ExtractionStatus;
  rawText: string;
  extractedFields: ExtractedFields;
  extractionTimestamp: string;
  latencyMs: number;
  notes: string;
}

export interface ObservedFact {
  source: 'linkedin' | 'instagram';
  fact: string;
  quoteOrSignal: string;
}

export interface Hypothesis {
  hypothesis: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
}

export interface AnalyzedProfile {
  id: string;
  participantId: string;
  supportedInterests: string[];
  hobbies: string[];
  lifestyleSignals: string[];
  relationshipPreferences: {
    evidenced: boolean;
    description?: string;
    sourceReference?: string;
  };
  confidence: {
    overall: 'HIGH' | 'MEDIUM' | 'LOW';
    score: number; // 0.0 - 1.0
    breakdown: {
      linkedinEvidenceScore: number;
      instagramEvidenceScore: number;
      recencyScore: number;
    };
    rationale: string;
  };
  observedFacts: ObservedFact[];
  hypotheses: Hypothesis[];
  missingInformation: string[];
  sensitiveTraitsPolicy: {
    applied: boolean;
    auditNote: string;
  };
  summary: string;
  analyzedAt: string;
}

export interface AgentPersona {
  participantId: string;
  name: string;
  tone: string;
  coreValues: string[];
  conversationStyle: string;
  curiosities: string[];
  activityPreferences: string[];
}

export interface ConversationTurn {
  id: string;
  conversationId: string;
  round: number;
  speakerId: string;
  speakerName: string;
  message: string;
  supportingEvidenceUsed: string[];
  topic: string;
  sentiment: 'positive' | 'curious' | 'warm' | 'neutral' | 'reserved';
  timestamp: string;
}

export interface ProposedActivity {
  proposerId: string;
  activity: string;
  acceptedByOther: boolean;
  rationale: string;
}

export interface DatingDecisions {
  participantAContinue: boolean;
  participantAReason: string;
  participantBContinue: boolean;
  participantBReason: string;
  mutualMatch: boolean;
}

export interface DatingConversation {
  id: string;
  participantAId: string;
  participantBId: string;
  participantAName: string;
  participantBName: string;
  status: 'in_progress' | 'completed' | 'declined';
  rounds: number;
  turns: ConversationTurn[];
  proposedActivity: ProposedActivity | null;
  decisions: DatingDecisions;
  createdAt: string;
  completedAt?: string;
}

export type MutualInterestIndicator =
  | 'MUTUAL_MATCH'
  | 'ONE_WAY_INTEREST'
  | 'POLITE_ACQUAINTANCE'
  | 'INCOMPATIBLE';

export interface CompatibilityScore {
  id: string;
  conversationId: string;
  participantAId: string;
  participantBId: string;
  overallScore: number; // 0 - 100
  breakdown: {
    sharedInterestsScore: number; // max 30
    preferenceAlignmentScore: number; // max 25
    complementaryGoalsScore: number; // max 20
    conversationQualityScore: number; // max 15
    dataConfidenceScore: number; // max 10
  };
  sharedInterests: string[];
  complementaryPoints: string[];
  potentialFrictions: string[];
  mutualInterestIndicator: MutualInterestIndicator;
  explanation: string;
  evaluatedAt: string;
}

export interface RankedCandidate {
  candidateId: string;
  candidateName: string;
  candidateAvatarUrl?: string;
  candidateHeadline?: string;
  overallScore: number;
  breakdown: CompatibilityScore['breakdown'];
  mutualInterestIndicator: MutualInterestIndicator;
  sharedInterests: string[];
  topComplementaryPoint: string;
  conversationId: string;
  proposedActivity: ProposedActivity | null;
  bothContinued: boolean;
  explanation: string;
}

export interface PersonalizedRanking {
  targetParticipant: Participant;
  rankedCandidates: RankedCandidate[];
  totalCandidatesDated: number;
  generatedAt: string;
}

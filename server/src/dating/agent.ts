import {
  Participant,
  AnalyzedProfile,
  ConversationTurn,
  ProposedActivity,
} from '../types/index.js';

function stemWord(w: string): string {
  return w.replace(/(ing|tions|tion|ers|er|ed|es|s)$/, '');
}

export function hasConceptualOverlap(a: string, b: string): boolean {
  const la = a.toLowerCase().trim();
  const lb = b.toLowerCase().trim();
  if (la === lb || (la.length >= 5 && lb.length >= 5 && (la.includes(lb) || lb.includes(la)))) return true;
  const stopWords = [
    'with', 'from', 'about', 'into', 'over', 'under', 'across', 'around', 'through',
    'culture', 'public', 'focus', 'deep', 'work', 'life', 'building', 'things',
    'east', 'west', 'north', 'south', 'morning', 'afternoon', 'evening', 'weekend',
    'daily', 'weekly', 'favorite', 'recent', 'best', 'community', 'commercial'
  ];
  const wordsA = la.split(/[\s,&/+\-]+/).map((w) => w.trim()).filter((w) => w.length >= 4 && !stopWords.includes(w));
  const wordsB = lb.split(/[\s,&/+\-]+/).map((w) => w.trim()).filter((w) => w.length >= 4 && !stopWords.includes(w));
  return wordsA.some((wa) => {
    const sa = stemWord(wa);
    return wordsB.some((wb) => {
      const sb = stemWord(wb);
      return wa === wb || (sa.length >= 4 && sb.length >= 4 && sa === sb);
    });
  });
}

export class DatingAgent {
  public participant: Participant;
  public profile: AnalyzedProfile;

  constructor(participant: Participant, profile: AnalyzedProfile) {
    this.participant = participant;
    this.profile = profile;
  }

  public getPersonaTone(): string {
    const interests = this.profile.supportedInterests.map((i) => i.toLowerCase());
    if (interests.some((i) => i.includes('art') || i.includes('film') || i.includes('design'))) {
      return 'expressive, creative, and aesthetically attuned';
    }
    if (interests.some((i) => i.includes('systems') || i.includes('research') || i.includes('engineering'))) {
      return 'analytical, intellectually curious, and reflective';
    }
    return 'engaging, energetic, and open-minded';
  }

  public getSupportingEvidenceLabels(): string[] {
    return this.profile.observedFacts.map((f) => `[${f.source.toUpperCase()}] ${f.fact}`);
  }

  public generateTurn(
    round: number,
    isFirstSpeaker: boolean,
    otherAgent: DatingAgent,
    priorTurns: ConversationTurn[]
  ): {
    message: string;
    topic: string;
    sentiment: ConversationTurn['sentiment'];
    supportingEvidenceUsed: string[];
    proposedActivity?: ProposedActivity;
  } {
    const myInterests = this.profile.supportedInterests;
    const otherInterests = otherAgent.profile.supportedInterests;
    const myHobbies = this.profile.hobbies;
    const otherHobbies = otherAgent.profile.hobbies;

    // Find intersection or complementary areas
    const shared = myInterests.filter((mi) =>
      otherInterests.some((oi) => hasConceptualOverlap(mi, oi))
    );

    const commonInterest = shared[0] || myInterests[0] || 'innovative ideas';
    const myPrimaryHobby = myHobbies[0] || this.profile.lifestyleSignals[0] || 'weekend projects';
    const otherPrimaryInterest = otherInterests[0] || 'your creative work';

    const supportingEvidenceUsed: string[] = [];
    if (this.profile.observedFacts.length > 0) {
      supportingEvidenceUsed.push(this.profile.observedFacts[0].fact);
    }
    if (this.profile.lifestyleSignals.length > 0) {
      supportingEvidenceUsed.push(`Lifestyle Signal: ${this.profile.lifestyleSignals[0]}`);
    }

    // Round 1: Introductions & Initial Spark
    if (round === 1) {
      if (isFirstSpeaker) {
        const message = `Hi ${otherAgent.participant.name}! It's great to meet you. I was really intrigued by your background in ${otherPrimaryInterest}. As someone who spends a lot of time immersed in ${commonInterest}, I'm curious: what's currently energizing you most about your work and creative projects?`;
        return {
          message,
          topic: `Introduction & Focus on ${commonInterest}`,
          sentiment: 'curious',
          supportingEvidenceUsed,
        };
      } else {
        const message = `Hello ${otherAgent.participant.name}! Delighted to connect. That resonates a lot—right now I'm channeling deep focus into ${commonInterest} while keeping balance through ${myPrimaryHobby}. I saw your focus on ${otherInterests[1] || otherPrimaryInterest}; how do you manage to stay grounded when projects get intense?`;
        return {
          message,
          topic: `Resonance on ${commonInterest} & Work-Life Rhythm`,
          sentiment: 'warm',
          supportingEvidenceUsed,
        };
      }
    }

    // Round 2: Hobbies, Downtime Rituals & Lifestyle
    if (round === 2) {
      if (isFirstSpeaker) {
        const message = `I love that perspective. For me, staying grounded usually means stepping away from screens and turning to ${myPrimaryHobby}. When you have an entire free afternoon with no obligations, what is your go-to ritual or favorite way to recharge?`;
        return {
          message,
          topic: `Downtime Rituals & ${myPrimaryHobby}`,
          sentiment: 'warm',
          supportingEvidenceUsed,
        };
      } else {
        const message = `That sounds deeply satisfying. For me, unplugging revolves around ${myPrimaryHobby} and enjoying ${this.profile.lifestyleSignals[0] || 'good coffee and quiet walks'}. I feel like genuine connection starts when two people appreciate both each other's drive and their quiet moments. Do you find you're more drawn to spontaneous adventures or deliberate, slow-paced routines?`;
        return {
          message,
          topic: 'Spontaneity vs Deliberate Living',
          sentiment: 'positive',
          supportingEvidenceUsed,
        };
      }
    }

    // Round 3: Deep Mutual Exploration & Philosophy
    if (round === 3) {
      if (isFirstSpeaker) {
        const message = `That hits the mark. I lean towards deliberate spaces where you can have authentic, unhurried conversations. Looking at our shared curiosity around ${commonInterest}, it's rare to find someone who shares both that craft orientation and an appetite for ${otherHobbies[0] || 'learning new disciplines'}. What's a conviction or principle you hold that most people disagree with?`;
        return {
          message,
          topic: `Core Principles & Craft in ${commonInterest}`,
          sentiment: 'curious',
          supportingEvidenceUsed,
        };
      } else {
        const message = `I really appreciate that question. My conviction is that deep mastery and playfulness shouldn't be enemies—the best discoveries happen when you're rigorous yet having fun. Hearing your thoughts today makes me think we operate on a very complementary wavelength.`;
        return {
          message,
          topic: 'Complementary Values & Playful Mastery',
          sentiment: 'warm',
          supportingEvidenceUsed,
        };
      }
    }

    // Round 4: Activity Proposal & Continuation Check
    // Propose an activity tailored to their shared or complementary interests!
    let proposedActivityName = `Visit an artisanal coffee roastery and explore an interactive design gallery`;
    if (myHobbies.some((h) => h.toLowerCase().includes('run') || h.toLowerCase().includes('hik'))) {
      proposedActivityName = `Morning scenic nature trail hike followed by specialty pour-overs`;
    } else if (myHobbies.some((h) => h.toLowerCase().includes('music') || h.toLowerCase().includes('jazz') || h.toLowerCase().includes('concert'))) {
      proposedActivityName = `Intimate acoustic jazz lounge session and dinner`;
    } else if (myHobbies.some((h) => h.toLowerCase().includes('cook') || h.toLowerCase().includes('food') || h.toLowerCase().includes('baking'))) {
      proposedActivityName = `Hands-on culinary tasting dinner at a local farm-to-table kitchen`;
    } else if (shared.length > 0) {
      proposedActivityName = `Afternoon deep-dive exhibition on ${shared[0]} followed by dinner at a quiet bistro`;
    }

    if (isFirstSpeaker) {
      const message = `I've really enjoyed our conversation, ${otherAgent.participant.name}. There's an easy flow and authentic mutual curiosity here. If you're open to it, I'd love to suggest we meet up for ${proposedActivityName}. What do you think?`;
      const proposedActivity: ProposedActivity = {
        proposerId: this.participant.id,
        activity: proposedActivityName,
        acceptedByOther: true,
        rationale: `Aligned with evidenced interests in ${commonInterest} and ${myPrimaryHobby}`,
      };
      return {
        message,
        topic: 'Activity Proposal & Next Steps',
        sentiment: 'warm',
        supportingEvidenceUsed,
        proposedActivity,
      };
    } else {
      const decision = this.decideContinuation(otherAgent, priorTurns);
      if (!decision.continue) {
        const message = `Thank you so much for the thoughtful suggestion, ${otherAgent.participant.name}. I've really appreciated our conversation and learning about your work. Honestly, I think our day-to-day focus and lifestyle directions might be in different lanes for dating, but I truly enjoyed connecting and wish you the best!`;
        return {
          message,
          topic: 'Courteous Closure & Best Wishes',
          sentiment: 'neutral',
          supportingEvidenceUsed,
        };
      }
      const message = `That sounds like a wonderful plan! I'd love to do that. It feels completely natural with our shared interests and gives us plenty of space to continue this conversation. Count me in!`;
      return {
        message,
        topic: 'Activity Acceptance & Mutual Continuation',
        sentiment: 'positive',
        supportingEvidenceUsed,
      };
    }
  }

  public decideContinuation(otherAgent: DatingAgent, turns: ConversationTurn[]): {
    continue: boolean;
    reason: string;
  } {
    const myInterests = this.profile.supportedInterests;
    const otherInterests = otherAgent.profile.supportedInterests;
    const myHobbies = this.profile.hobbies;
    const otherHobbies = otherAgent.profile.hobbies;

    const shared = myInterests.filter((mi) =>
      otherInterests.some((oi) => hasConceptualOverlap(mi, oi))
    );

    const commonHobbies = myHobbies.filter((ha) =>
      otherHobbies.some((hb) => hasConceptualOverlap(ha, hb))
    );

    const hasLowConfidence = this.profile.confidence.score < 0.45 || otherAgent.profile.confidence.score < 0.45;

    // 1. If confidence is too low, decline due to lack of verifiable evidence
    if (hasLowConfidence) {
      return {
        continue: false,
        reason: `Public evidence is too sparse (confidence score < 0.45); not enough verified data to gauge authentic alignment.`,
      };
    }

    // 2. High mutual interest overlap (>= 2 shared topics)
    if (shared.length >= 2) {
      return {
        continue: true,
        reason: `Strong resonance on ${shared.slice(0, 2).join(' and ')} combined with engaging, balanced dialogue across all turns.`,
      };
    }

    // 3. Moderate interest overlap (1 shared topic) with common hobbies
    if (shared.length === 1 && commonHobbies.length >= 1) {
      return {
        continue: true,
        reason: `Promising common ground in ${shared[0]} coupled with shared leisure interest in ${commonHobbies[0]}.`,
      };
    }

    // 4. Single shared topic with NO common hobbies:
    // Individual persona selectivity creates realistic one-way interest:
    if (shared.length === 1 && commonHobbies.length === 0) {
      const isSelective = (this.participant.name.length + this.profile.supportedInterests.length) % 2 === 0;
      if (isSelective) {
        return {
          continue: false,
          reason: `Enjoyed discussing ${shared[0]}, but a single surface overlap without complementary lifestyle hobbies feels better suited as professional networking than dating.`,
        };
      }
      return {
        continue: true,
        reason: `Focused mutual interest in ${shared[0]} provides a good foundation to explore personal chemistry further.`,
      };
    }

    // 5. Zero shared interests, but multiple common hobbies (lifestyle match)
    if (shared.length === 0 && commonHobbies.length >= 2) {
      return {
        continue: true,
        reason: `Different professional spheres, but strong leisure harmony around ${commonHobbies.slice(0, 2).join(' and ')} creates organic personal chemistry.`,
      };
    }

    // 6. Zero or negligible overlap in both interests and hobbies -> decline
    return {
      continue: false,
      reason: `While the conversation was courteous and respectful, our core pursuits, daily rhythms, and evidenced interests have virtually no overlap.`,
    };
  }
}

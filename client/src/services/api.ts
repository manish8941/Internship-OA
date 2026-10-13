import {
  Participant,
  AnalyzedProfile,
  ExtractionEvidence,
  DatingConversation,
  PersonalizedRanking,
} from '../types/index.js';

const API_BASE = '/api';

export interface ParticipantDetailResponse {
  participant: Participant;
  profile: AnalyzedProfile;
  evidences: ExtractionEvidence[];
  conversations: DatingConversation[];
}

export async function fetchHealth(): Promise<{
  status: string;
  llmProvider: string;
  useOllamaConfig: boolean;
}> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchParticipants(): Promise<Participant[]> {
  const res = await fetch(`${API_BASE}/participants`);
  if (!res.ok) throw new Error('Failed to fetch participants');
  return res.json();
}

export async function fetchParticipantDetail(id: string): Promise<ParticipantDetailResponse> {
  const res = await fetch(`${API_BASE}/participants/${id}`);
  if (!res.ok) throw new Error('Failed to fetch participant details');
  return res.json();
}

export async function ingestParticipant(
  name: string,
  linkedinUrl: string,
  instagramUrl: string
): Promise<{
  participant: Participant;
  profile: AnalyzedProfile;
  evidences: ExtractionEvidence[];
}> {
  const res = await fetch(`${API_BASE}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, linkedinUrl, instagramUrl }),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.details
      ? Object.values(data.details).join('; ')
      : data.error || 'Ingestion failed';
    throw new Error(errorMsg);
  }
  return data;
}

export async function fetchRankings(participantId: string): Promise<PersonalizedRanking> {
  const res = await fetch(`${API_BASE}/participants/${participantId}/rankings`);
  if (!res.ok) throw new Error('Failed to fetch rankings');
  return res.json();
}

export async function fetchConversations(): Promise<DatingConversation[]> {
  const res = await fetch(`${API_BASE}/conversations`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
}

export async function fetchConversationDetail(id: string): Promise<DatingConversation> {
  const res = await fetch(`${API_BASE}/conversations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch conversation');
  return res.json();
}

export async function startDate(
  participantAId: string,
  participantBId: string
): Promise<{ conversation: DatingConversation }> {
  const res = await fetch(`${API_BASE}/dating/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantAId, participantBId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to start date');
  }
  return res.json();
}

export async function fetchEvidences(): Promise<ExtractionEvidence[]> {
  const res = await fetch(`${API_BASE}/evidences`);
  if (!res.ok) throw new Error('Failed to fetch extraction evidences');
  return res.json();
}

export async function seedDemo(forceClear: boolean = false): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forceClear }),
  });
  if (!res.ok) throw new Error('Demo seeding failed');
  return res.json();
}

export async function simulateAllDates(): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/simulate-all`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Simulate all failed');
  return res.json();
}

export function subscribeLiveDate(
  participantAId: string,
  participantBId: string,
  speedMultiplier: number,
  onEvent: (event: any) => void,
  onError: (err: any) => void
): () => void {
  const url = `${API_BASE}/dating/live-stream?participantAId=${encodeURIComponent(
    participantAId
  )}&participantBId=${encodeURIComponent(participantBId)}&speedMultiplier=${speedMultiplier}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent(data);
      if (data.type === 'DATE_COMPLETED') {
        eventSource.close();
      }
    } catch (err) {
      onError(err);
    }
  };

  eventSource.onerror = (err) => {
    onError(err);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}

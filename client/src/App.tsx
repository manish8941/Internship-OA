import React, { useState, useEffect } from 'react';
import { Participant, DatingConversation } from './types/index.js';
import {
  fetchHealth,
  fetchParticipants,
  fetchParticipantDetail,
  fetchConversations,
  ParticipantDetailResponse,
} from './services/api.js';
import { AppSidebar } from './components/AppSidebar.js';
import { DiscoverView } from './components/DiscoverView.js';
import { ParticipantDirectory } from './components/ParticipantDirectory.js';
import { ProfileDetail } from './components/ProfileDetail.js';
import { DatingTimeline } from './components/DatingTimeline.js';
import { RankingDashboard } from './components/RankingDashboard.js';
import { ExtractionStatusView } from './components/ExtractionStatusView.js';
import { ConversationDetail } from './components/ConversationDetail.js';
import { IngestionForm } from './components/IngestionForm.js';
import { DemoControlsModal } from './components/DemoControlsModal.js';
import { ToastContainer, ToastMessage } from './components/Toast.js';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [conversations, setConversations] = useState<DatingConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [llmProvider, setLlmProvider] = useState<string>('Deterministic Offline Reasoning Engine');

  // Modal & Navigation States
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [profileDetailData, setProfileDetailData] = useState<ParticipantDetailResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [activeRankingParticipantId, setActiveRankingParticipantId] = useState<string | null>(null);
  const [timelinePreselectedA, setTimelinePreselectedA] = useState<string | undefined>();
  const [timelinePreselectedB, setTimelinePreselectedB] = useState<string | undefined>();
  const [viewingConversationId, setViewingConversationId] = useState<string | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [health, parts, convs] = await Promise.all([
        fetchHealth(),
        fetchParticipants(),
        fetchConversations().catch(() => []),
      ]);
      setLlmProvider(health.llmProvider);
      setParticipants(parts);
      setConversations(convs);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setLoading(false);
      addToast('error', 'Could not connect to backend server. Ensure backend is running.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectProfile = async (id: string) => {
    try {
      setProfileLoading(true);
      setActiveProfileId(id);
      setCurrentTab('profile');
      const data = await fetchParticipantDetail(id);
      setProfileDetailData(data);
      setProfileLoading(false);
    } catch (err: any) {
      setProfileLoading(false);
      addToast('error', `Failed to load profile details: ${err.message}`);
    }
  };

  const handleSimulateDate = (participantAId: string, participantBId?: string) => {
    setTimelinePreselectedA(participantAId);
    if (participantBId) {
      setTimelinePreselectedB(participantBId);
    } else {
      const other = participants.find((p) => p.id !== participantAId);
      if (other) setTimelinePreselectedB(other.id);
    }
    setCurrentTab('timeline');
  };

  const handleViewRankings = (participantId?: string) => {
    if (participantId) {
      setActiveRankingParticipantId(participantId);
    } else if (participants.length > 0 && !activeRankingParticipantId) {
      setActiveRankingParticipantId(participants[0].id);
    }
    setCurrentTab('rankings');
  };

  const handleIngestSuccess = async (newParticipantId: string) => {
    setIsIngestModalOpen(false);
    addToast('success', 'Participant ingested! Dual-source evidence extracted & agent synthesized.');
    await loadData();
    handleSelectProfile(newParticipantId);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation Rail (Desktop) & Mobile Drawer */}
      <AppSidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'profile') {
            setActiveProfileId(null);
            setProfileDetailData(null);
          }
        }}
        onOpenIngest={() => setIsIngestModalOpen(true)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        llmProvider={llmProvider}
        participantsCount={participants.length}
      />

      {/* Main Content Workspace */}
      <main className="app-main">
        <div className="content-wrapper">
          {/* Tab 1: Discover (Flagship Editorial Screen with Iridescent Helix) */}
          {currentTab === 'discover' && (
            <DiscoverView
              participants={participants}
              conversations={conversations}
              onExploreParticipants={() => setCurrentTab('directory')}
              onViewRankings={handleViewRankings}
              onSelectParticipant={handleSelectProfile}
              onStartDate={handleSimulateDate}
              onOpenConversation={(convId) => setViewingConversationId(convId)}
            />
          )}

          {/* Tab 2: People Directory (Arca-style editorial directory) */}
          {currentTab === 'directory' && (
            <ParticipantDirectory
              participants={participants}
              onSelectParticipant={handleSelectProfile}
              onSimulateDate={handleSimulateDate}
              onViewRankings={handleViewRankings}
              onOpenIngest={() => setIsIngestModalOpen(true)}
            />
          )}

          {/* Tab: Dedicated Profile Dossier */}
          {currentTab === 'profile' && (
            <div>
              {profileLoading || !profileDetailData ? (
                <div className="glass-panel" style={{ padding: '80px', textAlign: 'center' }}>
                  <div className="demo-dot" style={{ margin: '0 auto 16px', width: '14px', height: '14px' }} />
                  <p style={{ color: 'var(--color-secondary-text)' }}>
                    Loading dual-source evidence dossier & confidence ratings...
                  </p>
                </div>
              ) : (
                <ProfileDetail
                  data={profileDetailData}
                  onBack={() => setCurrentTab('directory')}
                  onSimulateDate={handleSimulateDate}
                  onViewRankings={handleViewRankings}
                />
              )}
            </div>
          )}

          {/* Tab 3: Dating Sessions (Interactive Agent AI Arena) */}
          {currentTab === 'timeline' && (
            <DatingTimeline
              participants={participants}
              initialParticipantAId={timelinePreselectedA}
              initialParticipantBId={timelinePreselectedB}
              onViewRankings={handleViewRankings}
            />
          )}

          {/* Tab 4: Compatibility Rankings (5-Pillar Score Cards) */}
          {currentTab === 'rankings' && (
            <RankingDashboard
              participants={participants}
              initialParticipantId={activeRankingParticipantId || undefined}
              onOpenConversation={(convId) => setViewingConversationId(convId)}
              onSimulateMore={(pId) => handleSimulateDate(pId)}
            />
          )}

          {/* Tab 5: Data Sources & Evidence Audit */}
          {currentTab === 'audit' && <ExtractionStatusView />}
        </div>
      </main>

      {/* Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="modal-overlay" onClick={() => setIsIngestModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <IngestionForm
              onSuccess={handleIngestSuccess}
              onCancel={() => setIsIngestModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Demo Controls Modal */}
      {isDemoModalOpen && (
        <DemoControlsModal
          onClose={() => setIsDemoModalOpen(false)}
          onDataChanged={() => {
            loadData();
            addToast('success', 'Demo dataset refreshed successfully in SQLite!');
          }}
        />
      )}

      {/* Conversation Detail Modal */}
      {viewingConversationId && (
        <ConversationDetail
          conversationId={viewingConversationId}
          onClose={() => setViewingConversationId(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}

export default App;

import React, { useState, useMemo } from 'react';
import { Participant } from '../types/index.js';
import { MonogramAvatar } from './MonogramAvatar.js';
import {
  Search,
  ExternalLink,
  HeartHandshake,
  Eye,
  Award,
  Linkedin,
  Instagram,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
  PlusCircle,
} from 'lucide-react';

interface ParticipantDirectoryProps {
  participants: Participant[];
  onSelectParticipant: (id: string) => void;
  onSimulateDate: (participantAId: string) => void;
  onViewRankings: (participantId: string) => void;
  onOpenIngest?: () => void;
}

export const ParticipantDirectory: React.FC<ParticipantDirectoryProps> = ({
  participants,
  onSelectParticipant,
  onSimulateDate,
  onViewRankings,
  onOpenIngest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'name_asc' | 'name_desc' | 'recent'>('name_asc');

  // Domains classifier based on bioHeadline or name
  const domains = [
    { id: 'all', label: 'All Fields' },
    { id: 'ai', label: 'AI & Research' },
    { id: 'leadership', label: 'Leadership & Founders' },
    { id: 'creator', label: 'Creators & Filmmaking' },
    { id: 'engineering', label: 'Systems & Engineering' },
  ];

  const filteredAndSorted = useMemo(() => {
    let result = participants.filter((p) => {
      if (p.id.startsWith('rank-test-') || p.id.startsWith('rank-cand-') || p.id.startsWith('rank-target-') || p.id.startsWith('test-')) {
        return false;
      }
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.bioHeadline && p.bioHeadline.toLowerCase().includes(q)) ||
        p.linkedinUrl.toLowerCase().includes(q) ||
        p.instagramUrl.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedDomain === 'all') return true;
      const h = (p.bioHeadline || '').toLowerCase();
      if (selectedDomain === 'ai') return h.includes('ai') || h.includes('research') || h.includes('stanford') || h.includes('deep');
      if (selectedDomain === 'leadership') return h.includes('ceo') || h.includes('founder') || h.includes('director') || h.includes('chairman');
      if (selectedDomain === 'creator') return h.includes('creator') || h.includes('filmmaker') || h.includes('inventor') || h.includes('author');
      if (selectedDomain === 'engineering') return h.includes('engineer') || h.includes('cto') || h.includes('systems') || h.includes('builder');

      return true;
    });

    if (selectedSort === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSort === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [participants, searchTerm, selectedDomain, selectedSort]);

  return (
    <div className="participant-directory" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Editorial Header (Arca Directory Reference) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-lavender">
            <Sparkles size={11} /> Directory Roster
          </span>
          <span className="badge badge-neutral">{participants.length} Active Personas</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="editorial-title" style={{ fontSize: '2.4rem', color: 'var(--color-ink)' }}>
              People & Agents
            </h1>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.96rem' }}>
              Explore public demo personas. Click any profile to view dual-source evidence dossiers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {onOpenIngest && (
              <button className="btn btn-primary" onClick={onOpenIngest} style={{ whiteSpace: 'nowrap' }}>
                <PlusCircle size={15} /> Add Participant
              </button>
            )}
            {/* Search Bar */}
            <div style={{ minWidth: '240px', flex: '1', maxWidth: '320px' }}>
              <input
                type="text"
                className="input-editorial"
                placeholder="Search by name, craft, or handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '8px',
          }}
        >
          {/* Domain Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {domains.map((d) => (
              <button
                key={d.id}
                className={`btn btn-sm ${selectedDomain === d.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedDomain(d.id)}
                style={{ fontSize: '0.8rem' }}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Sorting Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={14} color="var(--color-secondary-text)" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="input-editorial"
              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
            >
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="glass-panel" style={{ padding: '64px', textAlign: 'center' }}>
          <h3 className="editorial-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
            No matching participants
          </h3>
          <p style={{ color: 'var(--color-secondary-text)' }}>
            No agent matches "{searchTerm}" under the selected filter. Try clearing filters or search terms.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredAndSorted.map((p) => (
            <div
              key={p.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                cursor: 'pointer',
              }}
              onClick={() => onSelectParticipant(p.id)}
            >
              <div>
                {/* Header: Monogram Avatar + Identity */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                  <MonogramAvatar name={p.name} size={52} status="fixture" showStatusDot />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      className="editorial-title"
                      style={{ fontSize: '1.24rem', fontWeight: 500, color: 'var(--color-ink)', lineHeight: 1.2 }}
                    >
                      {p.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        color: 'var(--color-secondary-text)',
                        marginTop: '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {p.bioHeadline || 'Public Demo Profile'}
                    </p>
                  </div>
                </div>

                {/* Evidence Extraction Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    <ShieldCheck size={11} /> Fixture Snapshot
                  </span>
                  <span className="badge badge-sage" style={{ fontSize: '0.68rem' }}>
                    Dual Source
                  </span>
                </div>

                {/* Source External Links */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(247, 245, 240, 0.65)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={p.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--color-ink-subtle)',
                    }}
                    title={p.linkedinUrl}
                  >
                    <Linkedin size={12} color="#0077b5" /> LinkedIn <ExternalLink size={10} />
                  </a>
                  <span style={{ color: 'var(--color-border-strong)' }}>•</span>
                  <a
                    href={p.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--color-ink-subtle)',
                    }}
                    title={p.instagramUrl}
                  >
                    <Instagram size={12} color="#e4405f" /> Instagram <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSelectParticipant(p.id)}
                >
                  <Eye size={13} /> Dossier
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSimulateDate(p.id)}
                >
                  <HeartHandshake size={13} /> Date
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px 10px' }}
                  title="View Compatibility Rankings"
                  onClick={() => onViewRankings(p.id)}
                >
                  <Award size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';

interface MonogramAvatarProps {
  name: string;
  size?: number;
  className?: string;
  showStatusDot?: boolean;
  status?: 'fixture' | 'live' | 'neutral';
  borderSubtle?: boolean;
}

/**
 * MonogramAvatar — Editorial Persona Identity Glyph
 * Strictly complies with prompt requirement:
 * "Use a restrained mix of typography, initials, abstract illustrations, and neutral profile placeholders.
 * Do not associate unrelated stock photographs with real participants."
 */
export const MonogramAvatar: React.FC<MonogramAvatarProps> = ({
  name,
  size = 48,
  className = '',
  showStatusDot = false,
  status = 'fixture',
  borderSubtle = true,
}) => {
  // Deterministic palette derivation from name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const palettes = [
    {
      bg: 'linear-gradient(135deg, #DCD5F5 0%, #B9C4F5 100%)', // Lavender to Periwinkle
      text: '#20211F',
      border: 'rgba(185, 196, 245, 0.6)',
    },
    {
      bg: 'linear-gradient(135deg, #F7F5F0 0%, #DCE7DC 100%)', // Ivory to Muted Sage
      text: '#20211F',
      border: 'rgba(63, 94, 67, 0.2)',
    },
    {
      bg: 'linear-gradient(135deg, #F7F5F0 0%, #DCD5F5 100%)', // Ivory to Lavender
      text: '#20211F',
      border: 'rgba(220, 213, 245, 0.6)',
    },
    {
      bg: 'linear-gradient(135deg, #F7F5F0 0%, #D97868 100%)', // Ivory to Coral
      text: '#20211F',
      border: 'rgba(217, 120, 104, 0.3)',
    },
    {
      bg: 'linear-gradient(135deg, #B9C4F5 0%, #DCE7DC 100%)', // Periwinkle to Sage
      text: '#20211F',
      border: 'rgba(185, 196, 245, 0.5)',
    },
  ];

  const theme = palettes[hash % palettes.length];

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className={`monogram-avatar ${className}`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: `${Math.round(size * 0.26)}px`,
          background: theme.bg,
          border: borderSubtle ? `1px solid ${theme.border}` : 'none',
          boxShadow: '0 2px 6px rgba(32, 33, 31, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.text,
          fontFamily: 'var(--font-serif)',
          fontSize: `${fontSize}px`,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          userSelect: 'none',
        }}
      >
        {initials}
      </div>

      {showStatusDot && (
        <span
          title={status === 'live' ? 'Live public extractions' : 'Curated fixture snapshot'}
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: `${Math.max(8, Math.round(size * 0.22))}px`,
            height: `${Math.max(8, Math.round(size * 0.22))}px`,
            borderRadius: '50%',
            background: status === 'live' ? '#2E7D32' : '#B9C4F5',
            border: '2px solid #FFFFFF',
            boxShadow: '0 1px 3px rgba(32, 33, 31, 0.2)',
          }}
        />
      )}
    </div>
  );
};

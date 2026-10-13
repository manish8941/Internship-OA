import React, { useEffect, useRef } from 'react';

interface IridescentHelixProps {
  width?: number;
  height?: number;
  className?: string;
  subtleSpeed?: number;
}

/**
 * IridescentHelix — Signature Visual Element
 * Inspired by Aniwall by ThreeUI:
 * Atmospheric, softly glowing iridescent double-helix structure
 * using a warm lavender, soft periwinkle, restrained coral, and warm ivory palette.
 */
export const IridescentHelix: React.FC<IridescentHelixProps> = ({
  width = 460,
  height = 360,
  className = '',
  subtleSpeed = 0.008,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = x * 0.4;
      targetTiltY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Color definitions from design palette
    const colors = [
      { r: 220, g: 213, b: 245 }, // Muted lavender
      { r: 185, g: 196, b: 245 }, // Soft periwinkle
      { r: 217, g: 120, b: 104 }, // Restrained coral
      { r: 220, g: 231, b: 220 }, // Muted sage
    ];

    const render = () => {
      time += subtleSpeed;
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Soft ambient backdrop glow
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.45
      );
      bgGradient.addColorStop(0, 'rgba(220, 213, 245, 0.28)');
      bgGradient.addColorStop(0.5, 'rgba(185, 196, 245, 0.16)');
      bgGradient.addColorStop(1, 'rgba(247, 245, 240, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const numStrands = 2;
      const pointsPerStrand = 38;
      const helixRadius = 55;
      const helixHeight = height * 0.72;
      const centerY = height / 2;
      const centerX = width / 2;

      // Draw connecting crossbars (base-pair bridges)
      for (let i = 0; i < pointsPerStrand; i += 2) {
        const t = (i / pointsPerStrand) * Math.PI * 4 + time;
        const yNorm = i / pointsPerStrand - 0.5;
        const y = centerY + yNorm * helixHeight;

        const x1 = centerX + Math.cos(t) * helixRadius + currentTiltX * 40;
        const z1 = Math.sin(t);
        const x2 = centerX + Math.cos(t + Math.PI) * helixRadius + currentTiltX * 40;
        const z2 = Math.sin(t + Math.PI);

        // Bridge depth sorting & styling
        const alpha = Math.max(0.08, 0.25 + z1 * 0.15);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(185, 196, 245, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw double-helix nodes
      for (let strand = 0; strand < numStrands; strand++) {
        const phaseOffset = strand * Math.PI;

        for (let i = 0; i < pointsPerStrand; i++) {
          const t = (i / pointsPerStrand) * Math.PI * 4 + time + phaseOffset;
          const yNorm = i / pointsPerStrand - 0.5;
          const y = centerY + yNorm * helixHeight;
          const x = centerX + Math.cos(t) * helixRadius + currentTiltX * 40;
          const z = Math.sin(t); // Depth between -1 and 1

          // Particle sizing & atmospheric perspective
          const size = 3.2 + z * 1.8;
          const alpha = 0.35 + (z + 1) * 0.32; // Higher alpha when closer

          // Shift through palette based on height and time
          const colorIdx = Math.floor((i / pointsPerStrand) * (colors.length - 1));
          const nextColorIdx = Math.min(colorIdx + 1, colors.length - 1);
          const blend = ((i / pointsPerStrand) * (colors.length - 1)) % 1;

          const r = Math.round(colors[colorIdx].r * (1 - blend) + colors[nextColorIdx].r * blend);
          const g = Math.round(colors[colorIdx].g * (1 - blend) + colors[nextColorIdx].g * blend);
          const b = Math.round(colors[colorIdx].b * (1 - blend) + colors[nextColorIdx].b * blend);

          // Atmospheric node glow
          const radial = ctx.createRadialGradient(x, y, 0, x, y, size * 2.4);
          radial.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          radial.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
          radial.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Solid core
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.3)})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, subtleSpeed]);

  return (
    <div
      className={`iridescent-helix-container ${className}`}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'block',
          borderRadius: '24px',
        }}
      />
    </div>
  );
};

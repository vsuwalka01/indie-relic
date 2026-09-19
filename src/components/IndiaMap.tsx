'use client';
import { useState } from 'react';
import { CRAFT_MAP_SHAPES, CRAFT_MAP_VIEWBOX } from './craftMapPaths';
import { CRAFT_MAP_STATE_NAMES } from './craftMapNames';
import { getStateCraft } from '@/lib/stateCrafts';

interface IndiaMapProps {
  className?: string; pins?: string[]; activePin?: string | null;
  onPinClick?: (name: string) => void; onStateClick?: (name: string) => void;
  highlightState?: string; onStateHover?: (name: string) => void;
  /** Draws a running stitch between the pinned states. */
  thread?: boolean;
}
export default function IndiaMap({ className = '', pins = [], activePin, onPinClick, onStateClick, highlightState, onStateHover, thread = false }: IndiaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Ordered north-to-south so the stitch reads as one continuous journey
  // rather than criss-crossing the map at random.
  const threadPoints = thread
    ? pins
        .map((name) => CRAFT_MAP_SHAPES[CRAFT_MAP_STATE_NAMES.indexOf(name)])
        .filter(Boolean)
        .sort((a, b) => a.cy - b.cy)
        .map((s) => `${s.cx},${s.cy}`)
        .join(' ')
    : '';
  const preview = hovered ? getStateCraft(hovered) : undefined;
  const activate = onStateClick ?? onPinClick;
  const highlight = (name: string) => { setHovered(name); onStateHover?.(name); };
  return <div className={`craft-map-shell ${className}`}>
    <svg viewBox={CRAFT_MAP_VIEWBOX} preserveAspectRatio="xMidYMid meet" className="craft-map-svg" role={activate ? 'group' : 'img'} aria-label="Explore the craft traditions of India">
      {CRAFT_MAP_SHAPES.map((shape, i) => {
        const name = CRAFT_MAP_STATE_NAMES[i];
        return <path key={name} d={shape.d} data-state={name}
          className={`map-state ${highlightState === name || hovered === name ? 'is-active' : ''}`}
          role={activate ? 'link' : undefined} tabIndex={activate ? 0 : undefined} aria-label={`${name}: ${getStateCraft(name)?.craft ?? 'craft story'}`}
          onClick={() => activate?.(name)} onKeyDown={e => { if (activate && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activate(name); } }}
          onPointerEnter={() => highlight(name)} onPointerLeave={() => setHovered(null)} onFocus={() => highlight(name)} onBlur={() => setHovered(null)}>
          <title>{name}</title>
        </path>;
      })}
      {threadPoints && (
        <polyline
          className="thread-flow"
          points={threadPoints}
          fill="none"
          stroke="#9E2027"
          strokeWidth="1.6"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.5"
          pointerEvents="none"
          aria-hidden="true"
        />
      )}
      {pins.map(name => {
        const shape = CRAFT_MAP_SHAPES[CRAFT_MAP_STATE_NAMES.indexOf(name)];
        if (!shape) return null;
        // Stagger the beacons so they breathe out of step with each other.
        const delay = `${(CRAFT_MAP_STATE_NAMES.indexOf(name) % 7) * 0.32}s`;
        return <g key={name} pointerEvents="none" aria-hidden="true">
          <circle className="map-pin-ring" style={{ animationDelay: delay }} cx={shape.cx} cy={shape.cy} r="11" fill="none" stroke="#DAAC54" strokeWidth="1.5" />
          <circle className="map-pin-core" style={{ animationDelay: delay }} cx={shape.cx} cy={shape.cy} r="11" fill="#DAAC54" opacity="0.25" />
          <circle cx={shape.cx} cy={shape.cy} r={activePin === name ? 7 : 5} fill="#DAAC54" stroke="#F4F1DC" strokeWidth="2" />
        </g>;
      })}
    </svg>
    {activate && <div className="map-caption" aria-live="polite"><span>{preview?.state ?? 'A country of a thousand stories'}</span><strong>{preview?.craft ?? 'Touch a state. Discover its craft.'}{preview && ' ↗'}</strong></div>}
  </div>;
}

'use client';
import type { CSSProperties } from 'react';
import FlightBird from './FlightBird';

interface BirdMarkProps { className?: string; beat?: number; hover?: boolean }
export default function BirdMark({ className = '', beat = 0.85, hover = true }: BirdMarkProps) {
  return <div role="img" aria-label="Indie Relic hummingbird" className={className}
    style={{ '--wing-duration': beat + 's' } as CSSProperties}>
    <FlightBird perched={!hover} />
  </div>;
}

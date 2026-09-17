import { diamond, squares } from './birdPaths';

// Tight crop around just the diamond + cross-square glyph within the full
// bird canvas (see birdPaths.ts), so it can be reused standalone at any size.
const VB = '117.82 90.25 242.28 242.29';

interface DiamondCrossProps {
  className?: string;
  diamondFill?: string;
  crossFill?: string;
}

export default function DiamondCross({
  className = '',
  diamondFill = '#DAAC55',
  crossFill = '#9E2027',
}: DiamondCrossProps) {
  return (
    <svg viewBox={VB} className={className} aria-hidden>
      {diamond.map((s, i) => (
        <path key={`d${i}`} d={s.d} fill={diamondFill} />
      ))}
      {squares.map((s, i) => (
        <path key={`s${i}`} d={s.d} fill={crossFill} />
      ))}
      {/* the homepage/craft-map decoration adds a small centre dot the bird glyph doesn't have */}
      <rect x="234" y="206.4" width="10" height="10" fill={crossFill} />
    </svg>
  );
}

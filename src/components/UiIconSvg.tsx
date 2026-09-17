import type { UiIcon } from './uiIconPaths';

interface UiIconSvgProps {
  icon: UiIcon;
  size?: number;
  className?: string;
}

export default function UiIconSvg({ icon, size = 24, className = '' }: UiIconSvgProps) {
  return (
    <svg width={size} height={size} viewBox={icon.viewBox} className={className}>
      {icon.paths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

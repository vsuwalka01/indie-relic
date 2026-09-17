import type { HeaderIcon } from './headerIconPaths';

interface HeaderIconSvgProps {
  icon: HeaderIcon;
  size?: number;
  className?: string;
}

export default function HeaderIconSvg({ icon, size = 22, className = '' }: HeaderIconSvgProps) {
  return (
    <svg width={size} height={size} viewBox={icon.viewBox} className={className}>
      {icon.paths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

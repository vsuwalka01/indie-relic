import UiIconSvg from './UiIconSvg';
import { starIcon } from './uiIconPaths';

export default function StarRating({ count = 5, size = 16, className = '' }: { count?: number; size?: number; className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <UiIconSvg key={i} icon={starIcon} size={size} />
      ))}
    </div>
  );
}

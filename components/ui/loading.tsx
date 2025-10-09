import { SportingbetDot } from './dot'

interface LoadingProps {
  className?: string;
  width?: number;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function Loading({ className, width = 40, height = 40, showLabel = false, label = "Cargando..." }: LoadingProps) {
  return (
    <div className={className}>
      <div className="mx-auto flex flex-col items-center gap-3">
        <div className="animate-pulse">
          <SportingbetDot size={Math.min(width, height) * 0.6} />
        </div>
        {showLabel && (
          <span className="text-sm text-bwin-neutral-60 font-medium">{label}</span>
        )}
      </div>
    </div>
  )
} 
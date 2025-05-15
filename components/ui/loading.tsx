import Image from 'next/image'

interface LoadingProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Loading({ className, width = 40, height = 40 }: LoadingProps) {
  return (
    <div className={className}>
      <Image
        src="/soccer.gif"
        alt="Loading..."
        width={width}
        height={height}
        className="mx-auto"
      />
    </div>
  )
} 
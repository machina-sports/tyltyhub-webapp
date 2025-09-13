'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

export interface DotProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string; // Diameter of the circle
  className?: string;
  color?: string;
}

/**
 * The Sportingbet DOT component
 * Simple circle like the dot in the bwin logo's "i"
 */
export function Dot({
  size = 24,
  className,
  color,
  ...props
}: DotProps) {
  const { isDarkMode } = useTheme();
  // Use brand primary color instead of hardcoded yellow
  const defaultColor = 'hsl(var(--brand-primary))';
  const dotColor = color || defaultColor;
  
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;
  const radius = sizeNum / 2;

  return (
    <svg
      width={sizeNum}
      height={sizeNum}
      viewBox={`0 0 ${sizeNum} ${sizeNum}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block align-middle", className)}
      {...props}
    >
      <circle cx={radius} cy={radius} r={radius} fill={dotColor} />
    </svg>
  );
}

// Export variants with theme awareness
export function SportingbetDot(props: Omit<DotProps, 'color'>) {
  return <Dot color="hsl(var(--brand-primary))" {...props} />;
}

export function SportingbetDarkDot(props: Omit<DotProps, 'color'>) {
  return <Dot color="hsl(var(--brand-secondary))" {...props} />;
} 
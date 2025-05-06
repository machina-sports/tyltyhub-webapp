'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DotProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string; // Represents the desired visual width of the unskewed base rectangle part
  className?: string;
  color?: string;
}

/**
 * The Sportingbet DOT component
 * Using SVG path and skewX transform. Radius is calculated relative to the final size.
 *
 * Following brand guidelines interpretation:
 * - Base rectangle: 900px × 700px (aspect ratio maintained)
 * - Tilt: 12 degrees (interpreted as skewX(-12) applied to the shape - top leans left)
 * - Corner radius: 65px (scaled proportionally to the final size)
 */
export function Dot({
  size = 24,
  className,
  color = '#0A5EEA', // Default to Sportingbet Bright Blue
  ...props
}: DotProps) {
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;
  const originalWidth = 900;
  const originalHeight = 700;
  const aspectRatio = originalWidth / originalHeight;
  const w = sizeNum;
  const h = w / aspectRatio;

  // Scale the corner radii based on the FINAL size
  const rx = (65 / originalWidth) * w;
  const ry = (65 / originalHeight) * h;

  // Construct the path data using the SCALED radii
  const pathData = `
    M ${rx},0
    L ${w - rx},0
    A ${rx},${ry},0,0,1,${w},${ry}
    L ${w},${h - ry}
    A ${rx},${ry},0,0,1,${w - rx},${h}
    L ${rx},${h}
    A ${rx},${ry},0,0,1,0,${h - ry}
    L 0,${ry}
    A ${rx},${ry},0,0,1,${rx},0
    Z
  `;

  // Calculate the absolute horizontal offset caused by skewing
  const tanAngle = Math.tan(12 * Math.PI / 180);
  const skewOffset = h * tanAngle;
  const renderWidth = w + skewOffset;

  return (
    <svg
      width={renderWidth}
      height={h}
      // Adjust viewBox to capture the entire skewed shape.
      // With skewX(-12), the shape shifts left by `skewOffset` at the bottom.
      viewBox={`-${skewOffset} 0 ${renderWidth} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block align-middle", className)}
      overflow="visible"
      {...props}
    >
      {/* Path uses scaled radius, then skew is applied */}
      <path d={pathData} fill={color} transform={`skewX(-12)`} />
    </svg>
  );
}

// Export variants (no change needed here)
export function SportingbetDot(props: Omit<DotProps, 'color'>) {
  return <Dot color="#0A5EEA" {...props} />;
}
export function SportingbetDarkDot(props: Omit<DotProps, 'color'>) {
  return <Dot color="#001F3F" {...props} />;
} 
'use client';

import Image from 'next/image';
import { useBrandConfig } from '@/contexts/brand-context';

interface BrandLogoProps {
  variant?: 'icon' | 'full';
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ 
  variant = 'icon', 
  width, 
  height, 
  className = '',
  priority = false 
}: BrandLogoProps) {
  const brand = useBrandConfig();
  
  const logoConfig = brand.branding.logo;
  const logoPath = variant === 'icon' ? logoConfig.icon : logoConfig.full;
  
  // Default dimensions based on variant
  const defaultWidth = variant === 'icon' ? 32 : 120;
  const defaultHeight = variant === 'icon' ? 32 : 40;
  
  // Ensure bwin icon is fully rounded
  const extraClass = brand.id === 'bwin' && variant === 'icon' ? 'rounded-full' : '';
  const mergedClassName = [extraClass, className].filter(Boolean).join(' ');
  
  return (
    <Image
      src={logoPath}
      alt={logoConfig.alt}
      width={width || defaultWidth}
      height={height || defaultHeight}
      className={mergedClassName}
      priority={priority}
    />
  );
}

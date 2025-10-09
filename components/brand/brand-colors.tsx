'use client';

import { useBrandColors } from '@/hooks/use-brand-colors';

interface BrandColorsProps {
  children: React.ReactNode;
}

export function BrandColors({ children }: BrandColorsProps) {
  // Colors are now applied server-side via generateBrandCSS()
  // This component is kept for compatibility but doesn't apply colors via JS
  return <>{children}</>;
}

// Hook for getting brand color classes
export function useBrandColorClasses() {
  const { tailwindClasses } = useBrandColors();
  return tailwindClasses;
}

'use client';

import { useBrandConfig } from '@/contexts/brand-context';

interface BrandTextProps {
  type: 'title' | 'description' | 'displayName';
  className?: string;
  children?: React.ReactNode;
}

export function BrandText({ type, className = '', children }: BrandTextProps) {
  const brand = useBrandConfig();
  
  const getText = () => {
    switch (type) {
      case 'title':
        return brand.content.title;
      case 'description':
        return brand.content.description;
      case 'displayName':
        return brand.displayName;
      default:
        return '';
    }
  };

  const text = getText();
  
  if (children) {
    return <span className={className}>{children}</span>;
  }
  
  return <span className={className}>{text}</span>;
}

import { useBrandConfig } from '@/contexts/brand-context';

// Helper function to convert hex to HSL
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function useBrandColors() {
  const brand = useBrandConfig();
  const colors = brand.branding.colors;
  
  const cssVars = {
    '--bwin-brand-primary': hexToHsl(colors.primary),
    '--bwin-brand-secondary': hexToHsl(colors.secondary),
    '--bwin-success': hexToHsl(colors.success),
    '--bwin-warning': hexToHsl(colors.warning),
    '--bwin-danger': hexToHsl(colors.danger),
    '--bwin-info': hexToHsl(colors.info),
  };
  
  return {
    // Primary colors
    primary: colors.primary,
    secondary: colors.secondary,
    
    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    
    // CSS custom properties for dynamic theming
    cssVars,
    
    // Tailwind classes mapping
    tailwindClasses: {
      primary: `text-[${colors.primary}]`,
      'primary-bg': `bg-[${colors.primary}]`,
      'primary-border': `border-[${colors.primary}]`,
      secondary: `text-[${colors.secondary}]`,
      'secondary-bg': `bg-[${colors.secondary}]`,
      'secondary-border': `border-[${colors.secondary}]`,
      success: `text-[${colors.success}]`,
      'success-bg': `bg-[${colors.success}]`,
      warning: `text-[${colors.warning}]`,
      'warning-bg': `bg-[${colors.warning}]`,
      danger: `text-[${colors.danger}]`,
      'danger-bg': `bg-[${colors.danger}]`,
      info: `text-[${colors.info}]`,
      'info-bg': `bg-[${colors.info}]`,
    }
  };
}

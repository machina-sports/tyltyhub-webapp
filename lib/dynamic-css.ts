import { getBrandConfig } from '@/config/brands';

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

export function generateBrandCSS(): string {
  // Get brand from environment variable, fallback to bwin
  const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';
  const brand = getBrandConfig(brandId);
  const colors = brand.branding.colors;
  
  const primaryHsl = hexToHsl(colors.primary);
  const secondaryHsl = hexToHsl(colors.secondary);
  const successHsl = hexToHsl(colors.success);
  const warningHsl = hexToHsl(colors.warning);
  const dangerHsl = hexToHsl(colors.danger);
  const infoHsl = hexToHsl(colors.info);

  // Generate brand-specific CSS
  if (brandId === 'sportingbet') {
    return `
      :root {
        /* Sportingbet Brand Colors - Cor fundamental */
        --brand-primary: 207 95.24% 41.18% !important;
        --brand-secondary: 207 95.24% 50% !important;
        --brand-success: ${successHsl} !important;
        --brand-warning: ${warningHsl} !important;
        --brand-danger: ${dangerHsl} !important;
        --brand-info: ${infoHsl} !important;
        
        /* Sportingbet Neutral Colors */
        --neutral-100: 0 0% 100%;
        --neutral-90: 0 0% 98%;
        --neutral-80: 0 0% 90%;
        --neutral-70: 0 0% 75%;
        --neutral-60: 0 0% 60%;
        --neutral-50: 0 0% 45%;
        --neutral-40: 0 0% 30%;
        --neutral-30: 0 0% 25%;
        --neutral-25: 0 0% 22%;
        --neutral-20: 0 0% 18%;
        --neutral-15: 0 0% 15%;
        --neutral-10: 0 0% 12%;
        --neutral-0: 0 0% 8%;
        
        /* Sportingbet Background Colors - rgb(6, 31, 63) */
        --bg-primary: 220 100% 8%;
        --bg-secondary: 220 100% 12%;
        --bg-tertiary: 220 100% 15%;
        
        /* Override background for Sportingbet only - rgb(6, 31, 63) */
        --background: rgb(6, 31, 63);
        --bg-primary: 220 100% 8%;
        
        /* Sportingbet Border Colors - Cor fundamental */
        --border-primary: 207 95.24% 41.18%;
        --border-secondary: 207 95.24% 41.18% / 0.3;
        --border-accent: 207 95.24% 41.18% / 0.4;
        
        /* Override Tailwind background */
        --background: var(--bg-primary);
        --card: var(--bg-secondary);
        --border: var(--border-primary);
        
        /* Sportingbet Text Colors */
        --text-primary: 0 0% 100%;
        --text-secondary: 0 0% 90%;
        --text-muted: 0 0% 85%;
        
        /* Sportingbet Hover Colors */
        --hover: 0 0% 30%;
        --hover-light: 0 0% 35%;
        --hover-dark: 0 0% 25%;
        
        /* Sportingbet Scroll Colors */
        --scrollbar-thumb: 0 0% 30%;
        --scrollbar-track: 0 0% 15%;
      }
    `;
  }

  // Default bwin CSS
  return `
    :root {
      /* Bwin Brand Colors - Use exact primary yellow #FFCB00 */
      --brand-primary: ${primaryHsl} !important;
      --brand-secondary: ${secondaryHsl} !important;
      --brand-success: ${successHsl} !important;
      --brand-warning: ${warningHsl} !important;
      --brand-danger: ${dangerHsl} !important;
      --brand-info: ${infoHsl} !important;
      
      /* Bwin Border Colors */
      --border-primary: ${primaryHsl};
      
      /* Bwin Neutral Colors */
      --neutral-100: 0 0% 100%;
      --neutral-90: 0 0% 90%;
      --neutral-80: 0 0% 70%;
      --neutral-70: 0 0% 55%;
      --neutral-60: 0 0% 40%;
      --neutral-50: 0 0% 29%;
      --neutral-40: 0 0% 24%;
      --neutral-30: 0 0% 18%;
      --neutral-25: 0 0% 15%;
      --neutral-20: 0 0% 12%;
      --neutral-15: 0 0% 10%;
      --neutral-10: 0 0% 7%;
      --neutral-0: 0 0% 0%;
    }
  `;
}

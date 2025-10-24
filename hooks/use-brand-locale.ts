import { useBrand } from "@/contexts/brand-context";
import { ptBR, es } from 'date-fns/locale';
import { Locale } from 'date-fns';

/**
 * Hook to get the appropriate date-fns locale based on brand configuration
 */
export function useBrandLocale(): Locale {
  const { brand } = useBrand();
  
  // Map brand's dateLocale to date-fns locale
  const dateLocale = brand.branding?.ui?.dateLocale || brand.language;
  
  switch (dateLocale) {
    case 'pt-BR':
    case 'pt_BR':
      return ptBR;
    case 'es-ES':
    case 'es_ES':
      return es;
    default:
      return es; // fallback to Spanish
  }
}

/**
 * Hook to get brand-specific UI texts
 */
export function useBrandTexts() {
  const { brand } = useBrand();
  
  return {
    recent: brand.branding?.ui?.defaultTexts?.recent || 'Reciente',
    noArticles: brand.branding?.ui?.defaultTexts?.noArticles || 'No se encontraron artículos',
    noDescription: brand.branding?.ui?.defaultTexts?.noDescription || 'Sin descripción',
  };
}

/**
 * Hook to get brand-specific text color classes
 */
export function useBrandTextColors() {
  const { brand } = useBrand();
  
  return {
    muted: brand.branding?.ui?.textColors?.muted || 'text-muted-foreground',
  };
}


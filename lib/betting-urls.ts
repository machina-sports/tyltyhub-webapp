import { getBrandConfig } from '@/config/brands';

/**
 * Builds a betting URL for a specific market option
 */
export function buildBettingUrl({
  eventId,
  marketId,
  optionId,
  baseUrl,
  language
}: {
  eventId: string;
  marketId: string;
  optionId: string;
  baseUrl?: string;
  language?: string;
}) {
  // Format event ID if needed
  const formattedEventId = eventId.includes(':') ? eventId : `2:${eventId}`;
  
  // Get brand configuration
  const brand = getBrandConfig();
  
  // Use provided baseUrl, or brand's sportsBaseUrl, or fallback
  const resolvedBaseUrl = baseUrl 
    || brand.sportsBaseUrl
    || process.env.NEXT_PUBLIC_SPORTS_BASE_URL 
    || process.env.NEXT_PUBLIC_BWIN_BASE_URL 
    || 'https://www.bwin.es';
  
  // Use provided language or brand's language
  const resolvedLanguage = language || brand.language.split('-')[0];
  
  return `${resolvedBaseUrl}/${resolvedLanguage}/sports/events/${formattedEventId}?options=${formattedEventId}-${marketId}-${optionId}`;
}
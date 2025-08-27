/**
 * Builds a betting URL for a specific market option
 */
export function buildBettingUrl({
  eventId,
  marketId,
  optionId,
  baseUrl,
  language = 'en'
}: {
  eventId: string;
  marketId: string;
  optionId: string;
  baseUrl?: string;
  language?: string;
}) {
  // Format event ID if needed
  const formattedEventId = eventId.includes(':') ? eventId : `2:${eventId}`;
  
  // Prefer env domain if not provided explicitly
  const resolvedBaseUrl = baseUrl 
    || process.env.NEXT_PUBLIC_SPORTS_BASE_URL 
    || process.env.NEXT_PUBLIC_BWIN_BASE_URL 
    || 'https://www.bwin.es';
  
  return `${resolvedBaseUrl}/${language}/sports/events/${formattedEventId}?options=${formattedEventId}-${marketId}-${optionId}`;
}
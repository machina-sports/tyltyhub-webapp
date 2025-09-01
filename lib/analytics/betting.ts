import { DeeplinkParams } from '../deeplinks';

interface BettingAnalyticsParams extends DeeplinkParams {
  market_type?: string;
  market_title?: string;
  odds_value?: number;
  recommendation?: string;
  source?: string;
}

/**
 * Tracks betting link clicks with enhanced analytics
 */
export function trackBettingLinkClick(params: BettingAnalyticsParams) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const {
    eventId,
    marketId,
    optionId,
    market_type,
    market_title,
    odds_value,
    recommendation,
    source = 'chat'
  } = params;

  window.gtag('event', 'betting_link_click', {
    event_category: 'betting_navigation',
    event_action: 'click_betting_link',
    event_label: market_title ? `${market_title} - ${market_type}` : 'General Betting',
    market_type,
    market_title,
    odds_value,
    event_id: eventId,
    market_id: marketId,
    option_id: optionId,
    recommendation,
    source,
    has_deeplink: Boolean(eventId && marketId && optionId)
  });
}

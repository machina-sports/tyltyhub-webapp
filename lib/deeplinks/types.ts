/**
 * Types for Bwin Sports API Deeplinks
 */

export type SportContext = 'betting' | 'live' | 'in-30-minutes' | 'in-60-minutes' | 'today' | 'tomorrow' | 'after-2-days' | 'after-3-days';

export interface DeeplinkParams {
  baseUrl?: string;
  country?: string;
  language?: string;
  sportId?: string | number;
  leagueId?: string | number;
  eventId?: string;
  marketId?: string | number;
  optionId?: string | number;
  context?: SportContext;
}

export interface DeeplinkOptions {
  /**
   * Whether to format IDs (e.g., add "2:" prefix to event IDs)
   */
  formatIds?: boolean;
  
  /**
   * Whether to validate parameters before generating links
   */
  validate?: boolean;
}

export interface DeeplinkValidationError {
  field: string;
  message: string;
}

export type DeeplinkResult = {
  url: string;
  isValid: boolean;
  errors?: DeeplinkValidationError[];
}

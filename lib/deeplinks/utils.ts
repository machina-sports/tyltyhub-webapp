import { DeeplinkOptions, DeeplinkParams, DeeplinkResult, DeeplinkValidationError } from './types';

/**
 * Default configuration for deeplinks
 */
const DEFAULT_CONFIG = {
  baseUrl: 'https://www.bwin.es',
  country: 'es',
  language: 'es',
  sportId: '4', // Default to football/soccer
};

/**
 * Validates deeplink parameters based on requirements
 */
function validateDeeplinkParams(params: DeeplinkParams): DeeplinkValidationError[] {
  const errors: DeeplinkValidationError[] = [];

  // Required for specific bet option
  if (params.eventId && (!params.marketId || !params.optionId)) {
    errors.push({
      field: 'marketId/optionId',
      message: 'Market ID and Option ID are required when Event ID is provided'
    });
  }

  // Required for league view
  if (params.leagueId && !params.sportId) {
    errors.push({
      field: 'sportId',
      message: 'Sport ID is required when League ID is provided'
    });
  }

  return errors;
}

/**
 * Formats IDs according to API requirements
 */
function formatIds(params: DeeplinkParams): DeeplinkParams {
  const formatted = { ...params };

  // Add "2:" prefix to event IDs if not present
  if (formatted.eventId && !formatted.eventId.includes(':')) {
    formatted.eventId = `2:${formatted.eventId}`;
  }

  return formatted;
}

/**
 * Builds the base URL with country and language
 */
function buildBaseUrl(params: DeeplinkParams): string {
  const base = params.baseUrl || DEFAULT_CONFIG.baseUrl;
  const country = params.country || DEFAULT_CONFIG.country;
  const language = params.language || DEFAULT_CONFIG.language;

  return `${base}/${language}/sports`;
}

/**
 * Generates a deeplink URL based on provided parameters
 */
export function generateDeeplink(params: DeeplinkParams, options: DeeplinkOptions = {}): DeeplinkResult {
  const { formatIds: shouldFormat = true, validate = true } = options;

  // Apply defaults
  const fullParams = {
    ...DEFAULT_CONFIG,
    ...params
  };

  // Format IDs if requested
  const formattedParams = shouldFormat ? formatIds(fullParams) : fullParams;

  // Validate parameters if requested
  const errors = validate ? validateDeeplinkParams(formattedParams) : [];
  
  let url = buildBaseUrl(formattedParams);

  // Build URL based on provided parameters
  if (formattedParams.eventId && formattedParams.marketId && formattedParams.optionId) {
    // Specific bet option
    url = `${url}/events/${formattedParams.eventId}?options=${formattedParams.eventId}-${formattedParams.marketId}-${formattedParams.optionId}`;
  } else if (formattedParams.leagueId) {
    // League view
    url = `${url}/${formattedParams.sportId}/betting/leagues/${formattedParams.leagueId}`;
    if (formattedParams.context) {
      url += `?context=${formattedParams.context}`;
    }
  } else if (formattedParams.sportId) {
    // Sport view
    url = `${url}/${formattedParams.sportId}`;
    if (formattedParams.context) {
      url += `?context=${formattedParams.context}`;
    }
  }

  return {
    url,
    isValid: errors.length === 0,
    ...(errors.length > 0 && { errors })
  };
}

/**
 * Utility functions for URL detection and conversion
 */

/**
 * Regular expression to match URLs in text
 * Matches http://, https://, and www. URLs
 */
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

/**
 * Converts plain URLs in text to markdown links
 * @param text - The text containing URLs
 * @returns Text with URLs converted to markdown format
 */
export function convertUrlsToMarkdown(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  return text.replace(URL_REGEX, (url) => {
    // Ensure URL has protocol
    let href = url;
    if (url.startsWith('www.')) {
      href = `https://${url}`;
    }
    
    // Create markdown link
    return `[${url}](${href})`;
  });
}

/**
 * Detects if text contains URLs
 * @param text - The text to check
 * @returns True if text contains URLs
 */
export function containsUrls(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return URL_REGEX.test(text);
}

/**
 * Extracts all URLs from text
 * @param text - The text to extract URLs from
 * @returns Array of URLs found in the text
 */
export function extractUrls(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const matches = text.match(URL_REGEX);
  return matches ? matches.map(url => url.startsWith('www.') ? `https://${url}` : url) : [];
}

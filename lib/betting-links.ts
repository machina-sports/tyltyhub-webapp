/**
 * Replaces betting link patterns with markdown links
 * @param text - Text containing betting patterns like "2:7667490-186802546-672453170"
 * @param brandId - Brand ID to determine the sports base URL
 * @returns Text with betting patterns converted to markdown links
 */
export function replaceBettingLinks(text: string, brandId?: string): string {
  if (!text || typeof text !== 'string') return text;
  
  const sportsBaseUrl = brandId === 'sportingbet' 
    ? 'https://www.sportingbet.bet.br'
    : 'https://www.bwin.es';
  
  if (!sportsBaseUrl) return text;
  
  // Simple regex to match [text](2:id) patterns only
  const bettingLinkRegex = /\[([^\]]+)\]\((\d+):(\d+-\d+-\d+)\)/g;
  
  return text.replace(bettingLinkRegex, (match, displayText, prefix, linkId) => {
    const eventId = `2:${linkId.split('-')[0]}`;
    const fullOptionId = `2:${linkId}`;
    const deepLink = `${sportsBaseUrl}/en/sports/events/${eventId}?options=${fullOptionId}`;
    
    return `[${displayText}](${deepLink})`;
  });
}

/**
 * Processes message content to replace betting links
 * Handles both string content and object content with question_answer
 */
export function processMessageContent(content: any, brandId?: string): any {
  if (!content) return content;
  
  if (typeof content === 'string') {
    return replaceBettingLinks(content, brandId);
  }
  
  if (typeof content === 'object' && content.question_answer) {
    return {
      ...content,
      question_answer: replaceBettingLinks(content.question_answer, brandId)
    };
  }
  
  return content;
}

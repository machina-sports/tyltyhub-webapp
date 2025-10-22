/**
 * Get the agent ID based on the brand
 */
export function getAgentId(brandId: string): string {
  const agentIdMap: Record<string, string> = {
    'sportingbet': 'sportingbot-chat-assistant',
    'bwin': 'botandwin-chat-assistant',
    'tyltyhub': 'tyltyhub-chat-assistant',
  };
  
  return agentIdMap[brandId] || agentIdMap['bwin'];
}


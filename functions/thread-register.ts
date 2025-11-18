/**
 * Register a new thread/conversation in the backend
 * Calls the Next.js API route to keep API keys secure (server-side)
 */

export async function registerThread({
  agentId,
  userId,
  metadata = {}
}: {
  agentId: string;
  userId?: string;
  metadata?: Record<string, any>;
}): Promise<{ error: boolean; threadId: string | null }> {
  try {
    // Call the Next.js API route (server-side) to keep API keys secure
    const response = await fetch("/api/thread/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        userId,
        metadata
      }),
    });

    const result = await response.json();

    if (!result.error && result.threadId) {
      return { 
        error: false, 
        threadId: result.threadId 
      };
    }

    console.error("Failed to register thread:", result);
    return { error: true, threadId: null };

  } catch (error) {
    console.error("Error registering thread:", error);
    return { error: true, threadId: null };
  }
}

/**
 * Get thread history - loads all messages from thread
 */
export async function getThreadHistory(threadId: string): Promise<{
  error: boolean;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}> {
  try {
    // Call Next.js API route
    const response = await fetch(`/api/thread/${threadId}`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.error && result.messages) {
      return {
        error: false,
        messages: result.messages
      };
    }

    return { error: true, messages: [] };

  } catch (error) {
    console.error("Error getting thread history:", error);
    return { error: true, messages: [] };
  }
}

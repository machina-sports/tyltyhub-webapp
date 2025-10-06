/**
 * Streaming adapter for connecting assistant-ui to sportingbet-cwc backend
 *
 * This adapter handles:
 * - Converting assistant-ui message format to backend API format
 * - Streaming NDJSON responses from the backend
 * - Error handling and abort signal support
 * - Real-time text accumulation and yielding
 * - Optional workflow-by-workflow progress streaming
 *
 * Endpoint: /api/thread/stream
 */

import type { ChatModelAdapter } from "@assistant-ui/react";
import type React from "react";

export interface StreamingAdapterConfig {
  agentId: string;
  authToken?: string;
  headers?: Record<string, string>;
  streamWorkflows?: boolean; // Enable workflow-by-workflow progress streaming
  threadId?: string; // Thread ID for conversation tracking
  objectsMapRef?: React.MutableRefObject<Map<string, any[]>>; // Map to store objects per message
  onObjectsUpdate?: () => void; // Callback to trigger re-render when objects are updated
}

/**
 * Creates a streaming adapter with custom configuration
 *
 * @param config - Configuration object with all settings
 * @returns ChatModelAdapter for use with assistant-ui runtime
 *
 * @example
 * ```typescript
 * const adapter = createStreamingAdapterWithConfig({
 *   agentId: "my-agent-id",
 *   streamWorkflows: true,
 *   threadId: "thread-123"
 * });
 * ```
 */
export const createStreamingAdapterWithConfig = (
  config: StreamingAdapterConfig
): ChatModelAdapter => {
  return {
    async *run({ messages, abortSignal }) {
      try {
        // Get only the last message (the new user message)
        const lastMessage = messages[messages.length - 1];
        const formattedMessage = {
          role: lastMessage.role,
          content: lastMessage.content.map(c => {
            if (c.type === "text") return c.text;
            return "";
          }).join(""),
          timestamp: new Date().toISOString()
        };

        // Prepare headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        };

        // Add authentication if provided
        if (config.authToken) {
          headers['Authorization'] = `Bearer ${config.authToken}`;
        }

        // Use Next.js API route as middleware
        const endpoint = `/api/thread/stream`;

        // Prepare request body with last message and thread_id inside context-agent
        const requestBody: any = {
          stream_workflows: config.streamWorkflows || false
        };
        if (config.threadId) {
          requestBody["context-agent"] = {
            thread_id: config.threadId,
            messages: [formattedMessage]
          };
        }

        // Make the streaming request through Next.js middleware
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: abortSignal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        let fullText = '';
        let progressText = '';
        let buffer = '';
        let hasReceivedContent = false;
        let objects: any[] = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const chunk = JSON.parse(line);

              // Handle different chunk types
              if (chunk.type === 'content') {
                hasReceivedContent = true;

                // Check if this is a complete response (has metadata with state) or a streaming chunk
                if (chunk.metadata?.state?.document_content) {
                  // Complete response - replace everything
                  const message = chunk.metadata.state.document_content[0]?.content || chunk.content;
                  fullText = message;

                  // Extract objects if available
                  objects = chunk.metadata.state.document_content[0]?.objects || [];

                  // Store objects in map keyed by message text
                  if (config.objectsMapRef && objects.length > 0) {
                    config.objectsMapRef.current.set(fullText, objects);

                    // Trigger re-render callback
                    if (config.onObjectsUpdate) {
                      config.onObjectsUpdate();
                    }
                  }
                } else {
                  // Streaming chunk - accumulate it
                  fullText += chunk.content || '';
                }

                // Build content with text only
                yield {
                  role: "assistant" as const,
                  content: [
                    {
                      type: "text" as const,
                      text: fullText,
                    },
                  ],
                };
              } else if (!hasReceivedContent) {
                // Only show progress if we haven't received final content
                if (chunk.type === 'start') {
                  progressText = chunk.content ? `${chunk.content}\n\n` : '';
                } else if (chunk.type === 'workflow_start') {
                  progressText = `🔄 ${chunk.content}`;
                } else if (chunk.type === 'workflow_complete') {
                  progressText = `✓ ${chunk.content}`;
                } else if (chunk.type === 'workflow_output') {
                  progressText = `→ ${chunk.content}`;
                } else if (chunk.type === 'workflow_error') {
                  progressText = `❌ ${chunk.content}`;
                }

                // Yield progress text (it will replace previous progress)
                if (progressText) {
                  yield {
                    role: "assistant" as const,
                    content: [
                      {
                        type: "text" as const,
                        text: progressText,
                      },
                    ],
                  };
                }
              } else if (chunk.type === 'done') {
                // Stream completed - if no content received, keep last progress
                if (!hasReceivedContent && progressText) {
                  fullText = progressText;

                  yield {
                    role: "assistant" as const,
                    content: [
                      {
                        type: "text" as const,
                        text: fullText,
                      },
                    ],
                  };
                }
              } else if (chunk.type === 'error') {
                throw new Error(chunk.content);
              }
            } catch (parseError) {
              console.error('Failed to parse chunk:', line, parseError);
            }
          }
        }

      } catch (error) {
        console.error('Streaming error:', error);

        yield {
          role: "assistant" as const,
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
            },
          ],
        };
      }
    },
  };
};

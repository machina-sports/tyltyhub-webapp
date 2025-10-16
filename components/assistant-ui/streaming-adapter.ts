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
  suggestionsMapRef?: React.MutableRefObject<Map<string, string[]>>; // Map to store suggestions per message
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
        let suggestions: string[] = [];
        let shouldExit = false;

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log('[StreamAdapter] Stream ended by server');
              break;
            }

            buffer += decoder.decode(value, { stream: false });

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;

              try {
                const chunk = JSON.parse(line);
                console.log('[StreamAdapter] Received chunk:', { type: chunk.type, hasContent: !!chunk.content, hasDocContent: !!(chunk.metadata?.state?.document_content || chunk.document_content) });

              // Handle different chunk types
              // Check for done FIRST before other logic
              if (chunk.type === 'done') {
                // Mark as done - stream is complete
                console.log('[StreamAdapter] ✓✓✓ DONE signal received!');
                
                // Save final state if available
                if (chunk.metadata?.state) {
                  console.log('[StreamAdapter] Final state:', chunk.metadata.state);
                  
                  // Try multiple possible locations for content
                  const state = chunk.metadata.state;
                  let finalContent = '';
                  
                  // Check for document_content array (legacy format)
                  const finalDocContent = state.document_content;
                  if (finalDocContent && Array.isArray(finalDocContent) && finalDocContent.length > 0) {
                    finalContent = finalDocContent[0]?.content || '';
                    
                    // Extract objects and suggestions from document_content
                    const finalObjects = finalDocContent[0]?.objects || [];
                    if (finalObjects.length > 0) {
                      objects = finalObjects;
                    }
                    
                    const finalSuggestions = finalDocContent[0]?.suggestions || [];
                    if (finalSuggestions.length > 0) {
                      suggestions = finalSuggestions;
                    }
                  } 
                  // Check for direct content/response keys in state
                  else if (state.content) {
                    finalContent = state.content;
                  } 
                  else if (state.response) {
                    finalContent = state.response;
                  }
                  else if (state.output) {
                    finalContent = state.output;
                  }
                  
                  if (finalContent) {
                    fullText = finalContent;
                    hasReceivedContent = true;
                    console.log('[StreamAdapter] Extracted content from state, length:', finalContent.length);
                  }
                }
                
                // If no content received at all, use last progress
                if (!hasReceivedContent && progressText) {
                  fullText = progressText;
                  hasReceivedContent = true;
                }

                // Yield final content if we have it
                if (hasReceivedContent && fullText) {
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
                
                // Exit the loop - we're done
                shouldExit = true;
                break;
              }
              else if (chunk.type === 'content') {
                // Check multiple possible locations for document_content
                const documentContent = chunk.metadata?.state?.document_content || chunk.document_content;
                
                // Check for metadata markers (final, workflow_complete)
                const isFinalMarker = chunk.metadata?.final === true;
                const isWorkflowCompleteMarker = chunk.metadata?.workflow_complete === true;
                
                // Skip empty content with metadata markers (they're just markers)
                if (!chunk.content && !documentContent && (isFinalMarker || isWorkflowCompleteMarker)) {
                  continue;
                }

                // documentContent contains the COMPLETE final message - replace, don't append
                if (documentContent && Array.isArray(documentContent) && documentContent.length > 0) {
                  // This is the final complete response - REPLACE fullText
                  const finalContent = documentContent[0]?.content || '';
                  
                  // Only update if we got content
                  if (finalContent) {
                    fullText = finalContent;
                    hasReceivedContent = true;
                  }

                  // Extract objects if available
                  const newObjects = documentContent[0]?.objects || [];
                  if (newObjects.length > 0) {
                    objects = newObjects;
                  }

                  // Extract suggestions if available
                  const newSuggestions = documentContent[0]?.suggestions || [];
                  if (newSuggestions.length > 0) {
                    suggestions = newSuggestions;
                  }

                  // Yield the complete final text
                  if (fullText) {
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
                } else if (chunk.content) {
                  // Regular streaming chunk - APPEND
                  fullText += chunk.content;
                  hasReceivedContent = true;

                  // Yield accumulated text
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
              } else if (!hasReceivedContent) {
                // Only show progress if we haven't received final content
                if (chunk.type === 'start') {
                  progressText = chunk.content ? `${chunk.content}\n\n` : '';
                } else if (chunk.type === 'workflow_start') {
                  progressText = `${chunk.content}`;
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
              } else if (chunk.type === 'workflow_error' || chunk.type === 'error') {
                console.error('[StreamAdapter] Received ERROR:', chunk.content);
                throw new Error(chunk.content);
              }
              } catch (parseError) {
                console.error('[StreamAdapter] Failed to parse chunk:', line, parseError);
              }
            }
            
            // Break outer loop if done signal received
            if (shouldExit) {
              console.log('[StreamAdapter] Exiting stream loop');
              break;
            }
          }
        } finally {
          // Always release the reader lock
          reader.releaseLock();
          console.log('[StreamAdapter] Reader lock released');
        }

        console.log('[StreamAdapter] Processing complete. hasReceivedContent:', hasReceivedContent, 'fullText length:', fullText.length);

        // After stream completes, store objects and suggestions in map
        if (hasReceivedContent && fullText) {
          if (config.objectsMapRef && objects.length > 0) {
            config.objectsMapRef.current.set(fullText, objects);
          }

          if (config.suggestionsMapRef && suggestions.length > 0) {
            config.suggestionsMapRef.current.set(fullText, suggestions);
          }

          // Trigger re-render callback once at the end
          if (config.onObjectsUpdate && (objects.length > 0 || suggestions.length > 0)) {
            config.onObjectsUpdate();
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

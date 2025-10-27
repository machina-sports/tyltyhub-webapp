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
import { getBrandConfig } from "@/config/brands";

export interface StreamingAdapterConfig {
  agentId: string;
  authToken?: string;
  headers?: Record<string, string>;
  streamWorkflows?: boolean; // Enable workflow-by-workflow progress streaming
  threadId?: string; // Thread ID for conversation tracking
  objectsMapRef?: React.MutableRefObject<Map<string, any[]>>; // Map to store objects per message
  suggestionsMapRef?: React.MutableRefObject<Map<string, string[]>>; // Map to store suggestions per message
  animatedWidgetsRef?: React.MutableRefObject<Set<string>>; // Track which widgets should NOT animate (already shown)
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
          // Get brand configuration for status message
          const brand = getBrandConfig();
          const statusMessage = brand.content?.assistant?.statusMessage || "Interpretando tu pregunta...";

          requestBody["context-agent"] = {
            thread_id: config.threadId,
            messages: [formattedMessage],
            status_message: statusMessage
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
        let hasReceivedFinalContent = false; // Track if we received the final content event
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
                
                let shouldYield = false;
                let previousFullText = fullText;
                let finalContent = '';
                
                // Extract from standardized metadata structure
                if (chunk.metadata) {
                  finalContent = chunk.metadata.content || '';
                  const finalObjects = chunk.metadata.objects || [];
                  const finalSuggestions = chunk.metadata.suggestions || [];
                  
                  if (finalContent) {
                    // If we already received the final content event, don't replace it
                    if (hasReceivedFinalContent) {
                      console.log('[StreamAdapter] Already received final content, ensuring objects are mapped');
                      // Just ensure objects are mapped to current text
                      if (config.objectsMapRef && objects.length > 0 && fullText) {
                        config.objectsMapRef.current.set(fullText, objects);
                      }
                      // No need to yield - we already have the correct text
                    } else if (!hasReceivedContent || !fullText) {
                      // Haven't received any content yet - use done metadata
                      fullText = finalContent;
                      hasReceivedContent = true;
                      shouldYield = true;
                      console.log('[StreamAdapter] Using content from done metadata, length:', finalContent.length);
                    } else {
                      // We have streamed chunks but not the final content event
                      // Check if done metadata differs from accumulated chunks
                      console.log('[StreamAdapter] Have chunks but not final content, comparing with done metadata');
                      if (finalContent !== fullText) {
                        console.log('[StreamAdapter] ⚠️ Done metadata differs from chunks! Using done metadata as authoritative');
                        // Transfer objects to the new text BEFORE changing fullText
                        if (config.objectsMapRef && objects.length > 0) {
                          console.log('[StreamAdapter] Pre-transferring', objects.length, 'objects to new text');
                          config.objectsMapRef.current.set(finalContent, objects);
                          // Keep at old text too temporarily
                          config.objectsMapRef.current.set(fullText, objects);
                        }
                        fullText = finalContent;
                        shouldYield = true;
                      } else {
                        console.log('[StreamAdapter] Done metadata matches accumulated chunks, no need to yield');
                      }
                    }
                  }
                  
                  if (finalObjects.length > 0) {
                    console.log('[StreamAdapter] Received', finalObjects.length, 'final objects in done event');
                    objects = finalObjects;
                    // Associate final objects with current text - CRITICAL for preventing flicker
                    if (config.objectsMapRef && fullText) {
                      config.objectsMapRef.current.set(fullText, finalObjects);
                      // Also keep at previous text if different
                      if (previousFullText && previousFullText !== fullText) {
                        config.objectsMapRef.current.set(previousFullText, finalObjects);
                      }
                      // Trigger re-render
                      config.onObjectsUpdate?.();
                    }
                  }
                  
                  if (finalSuggestions.length > 0) {
                    suggestions = finalSuggestions;
                  }
                }
                
                // If no meaningful final content, preserve the last status message
                if (!finalContent && progressText) {
                  // No final content was provided, but we have a status message - keep showing it
                  if (!fullText || fullText === progressText) {
                    console.log('[StreamAdapter] Preserving last status message:', progressText.substring(0, 50));
                    fullText = progressText;
                    hasReceivedContent = true;
                    shouldYield = true;
                  }
                } else if (!hasReceivedContent && progressText) {
                  // Fallback: No content received at all, use last progress
                  fullText = progressText;
                  hasReceivedContent = true;
                  shouldYield = true;
                }

                // Only yield if we have new content or if this is the first content
                if (shouldYield && hasReceivedContent && fullText) {
                  console.log('[StreamAdapter] Yielding final content');
                  yield {
                    role: "assistant" as const,
                    content: [
                      {
                        type: "text" as const,
                        text: fullText,
                      },
                    ],
                  };
                } else {
                  console.log('[StreamAdapter] Skipping final yield (no changes or already yielded)');
                }
                
                // Exit the loop - we're done
                shouldExit = true;
                break;
              }
              else if (chunk.type === 'content') {
                // Content chunks are streamed text
                if (chunk.content) {
                  const previousText = fullText;
                  const isFinal = chunk.metadata?.final === true;
                  
                  if (isFinal) {
                    // This is the final complete content - REPLACE fullText
                    console.log('[StreamAdapter] Received FINAL content, length:', chunk.content.length);
                    fullText = chunk.content;
                    hasReceivedFinalContent = true;
                  } else {
                    // Regular chunk - APPEND to fullText
                    fullText += chunk.content;
                  }
                  hasReceivedContent = true;
                  
                  // If we had objects from earlier workflow_objects event, associate them with this text now
                  if (objects.length > 0 && config.objectsMapRef) {
                    console.log('[StreamAdapter] Associating', objects.length, 'objects with content:', fullText.substring(0, 50));
                    config.objectsMapRef.current.set(fullText, objects);
                    
                    // Also keep the association with previous texts so cards don't flicker during transition
                    if (previousText && previousText !== fullText) {
                      config.objectsMapRef.current.set(previousText, objects);
                    }
                    if (progressText && progressText !== fullText) {
                      console.log('[StreamAdapter] Keeping objects also at progressText for smooth transition');
                      config.objectsMapRef.current.set(progressText, objects);
                    }
                    
                    config.onObjectsUpdate?.();
                  }

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
              } else if (chunk.type === 'workflow_objects') {
                // Handle workflow_objects ALWAYS (not conditional)
                // Accumulate objects from workflow completion
                if (chunk.metadata?.objects) {
                  objects = chunk.metadata.objects;
                  console.log('[StreamAdapter] Received workflow_objects:', objects.length, 'objects');
                  
                  // Associate objects with current text (could be fullText or progressText)
                  if (config.objectsMapRef) {
                    const currentText = fullText || progressText || 'Loading...';
                    console.log('[StreamAdapter] Associating objects with current text:', currentText.substring(0, 50));
                    config.objectsMapRef.current.set(currentText, objects);
                    
                    // If we have fullText (streaming content), keep objects there as text grows
                    if (fullText) {
                      config.objectsMapRef.current.set(fullText, objects);
                    }
                    // Also keep at progressText for smooth transition
                    if (progressText && progressText !== fullText) {
                      config.objectsMapRef.current.set(progressText, objects);
                    }
                    
                    config.onObjectsUpdate?.();
                  }
                  
                  // If we don't have streaming content yet, yield progress to show objects
                  if (!hasReceivedContent || !fullText) {
                    const displayText = fullText || progressText || '⏳ Loading...';
                    yield {
                      role: "assistant" as const,
                      content: [
                        {
                          type: "text" as const,
                          text: displayText,
                        },
                      ],
                    };
                  }
                }
              } else if (chunk.type === 'status_update') {
                // Handle status updates ALWAYS (show updates even when objects exist)
                if (!hasReceivedFinalContent) {
                  const statusMsg = chunk.metadata?.status_message || chunk.content;
                  console.log('[StreamAdapter] status_update received:', statusMsg);
                  
                  if (statusMsg) {
                    // Don't add loading icon - status messages have their own icons
                    progressText = statusMsg;
                    
                    // Yield progress text even if objects exist
                    yield {
                      role: "assistant" as const,
                      content: [
                        {
                          type: "text" as const,
                          text: progressText,
                        },
                      ],
                    };
                    
                    // Keep objects associated with progress text for smooth transition
                    if (objects.length > 0 && config.objectsMapRef) {
                      config.objectsMapRef.current.set(progressText, objects);
                      config.onObjectsUpdate?.();
                    }
                  }
                }
              } else if (!hasReceivedContent && objects.length === 0) {
                // Only show other progress messages if we haven't received content AND no objects yet
                if (chunk.type === 'start') {
                  // Use status_message if available, otherwise use content
                  const statusMsg = chunk.metadata?.status_message;
                  // Don't add loading icon - messages have their own formatting
                  progressText = statusMsg ? statusMsg : (chunk.content ? chunk.content : '');
                  
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
                } else if (chunk.type === 'workflow_start') {
                  console.log('[StreamAdapter] workflow_start received:', {
                    content: chunk.content,
                    metadata: chunk.metadata,
                    currentProgressText: progressText
                  });

                  // Only show workflow_start if we don't have a recent status message
                  // This prevents overwriting status updates from previous workflow
                  const isInitialStart = !progressText || progressText.includes('Loading');
                  
                  if (isInitialStart) {
                    // First workflow or no previous status - show the start message
                    // Don't add loading icon - messages have their own formatting
                    progressText = chunk.content;
                    
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
                  // Otherwise, let previous status message persist
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

        console.log('[StreamAdapter] Processing complete. hasReceivedContent:', hasReceivedContent, 'fullText length:', fullText.length, 'objects:', objects.length);

        // After stream completes, store objects and suggestions in map
        if (hasReceivedContent && fullText) {
          const isNewObjects = config.objectsMapRef && !config.objectsMapRef.current.has(fullText) && objects.length > 0;
          const isNewSuggestions = config.suggestionsMapRef && !config.suggestionsMapRef.current.has(fullText) && suggestions.length > 0;
          
          if (config.objectsMapRef && objects.length > 0) {
            console.log('[StreamAdapter] Final: Setting objects for text:', fullText.substring(0, 50));
            config.objectsMapRef.current.set(fullText, objects);
            
            // Clean up only truly temporary keys, but keep progressText if it had the cards
            config.objectsMapRef.current.delete('loading');
            // DON'T delete progressText - it might still be used by the displayed message
            // Only delete empty string if it's different from progressText
            if (progressText !== '') {
              config.objectsMapRef.current.delete('');
            }
          }

          if (config.suggestionsMapRef && suggestions.length > 0) {
            config.suggestionsMapRef.current.set(fullText, suggestions);
          }

          // Mark new widgets so they DON'T get marked as "should animate"
          // (they're from streaming, so they should appear immediately without animation on first load)
          if (config.animatedWidgetsRef) {
            if (isNewObjects) {
              // Don't mark - let them animate!
            }
            if (isNewSuggestions) {
              // Don't mark - let them animate!
            }
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

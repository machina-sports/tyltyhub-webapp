import { useRef, useEffect, useState } from "react";

/**
 * Custom hook to manage object and suggestion refs for messages
 * Populates refs from raw messages on mount
 */
export function useMessageRefs(rawMessages?: any[]) {
  const objectsMapRef = useRef<Map<string, any[]>>(new Map());
  const suggestionsMapRef = useRef<Map<string, string[]>>(new Map());
  const animatedWidgetsRef = useRef<Set<string>>(new Set());
  const [objectsVersion, setObjectsVersion] = useState(0);

  // Populate refs from raw messages on mount
  useEffect(() => {
    if (rawMessages && rawMessages.length > 0) {
      rawMessages.forEach((msg: any) => {
        if (msg.role === 'assistant') {
          const textContent = typeof msg.content === 'string' ? msg.content : msg.content?.content || '';
          
          // Extract objects from document_content if available
          const docContent = msg.document_content?.[0];
          if (docContent) {
            if (docContent.objects && docContent.objects.length > 0) {
              objectsMapRef.current.set(textContent, docContent.objects);
              // Mark these widgets as pre-existing (no animation on page load)
              animatedWidgetsRef.current.add(`markets-${textContent}`);
              animatedWidgetsRef.current.add(`articles-${textContent}`);
            }
            if (docContent.suggestions && docContent.suggestions.length > 0) {
              suggestionsMapRef.current.set(textContent, docContent.suggestions);
              // Mark these widgets as pre-existing (no animation on page load)
              animatedWidgetsRef.current.add(`suggestions-${textContent}`);
            }
          } else {
            // Fallback to root level
            if (msg.objects && msg.objects.length > 0) {
              objectsMapRef.current.set(textContent, msg.objects);
              animatedWidgetsRef.current.add(`markets-${textContent}`);
              animatedWidgetsRef.current.add(`articles-${textContent}`);
            }
            if (msg.suggestions && msg.suggestions.length > 0) {
              suggestionsMapRef.current.set(textContent, msg.suggestions);
              animatedWidgetsRef.current.add(`suggestions-${textContent}`);
            }
          }
        }
      });
      setObjectsVersion(v => v + 1);
    }
  }, [rawMessages]);

  return {
    objectsMapRef,
    suggestionsMapRef,
    animatedWidgetsRef,
    objectsVersion,
    setObjectsVersion,
  };
}


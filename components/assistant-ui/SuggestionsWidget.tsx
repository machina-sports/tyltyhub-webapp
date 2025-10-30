"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SuggestionsWidgetProps {
  suggestions: string[];
  textContent: string;
  shouldAnimate: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export function SuggestionsWidget({ 
  suggestions, 
  textContent, 
  shouldAnimate, 
  onSuggestionClick 
}: SuggestionsWidgetProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`suggestions-${textContent}`}
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        className="mt-3 space-y-2 w-auto"
      >
        {suggestions.map((suggestion: string, index: number) => (
          <motion.button
            key={`${textContent}-${index}`}
            initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            onClick={() => onSuggestionClick(suggestion)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-left bg-card border border-border rounded-lg hover:bg-brand-primary/10 hover:border-brand-primary/60 transition-colors w-auto"
          >
            <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="break-words">{suggestion}</span>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}


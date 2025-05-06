"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"

export default function FollowUpQuestionForm() {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    setInput("");
  };

  const handleMicPress = () => {
    setIsPreparing(true);
    
    if (prepareTimeoutRef.current) {
      clearTimeout(prepareTimeoutRef.current);
    }

    prepareTimeoutRef.current = setTimeout(() => {
      setIsPreparing(false);
      setIsRecording(true);
      prepareTimeoutRef.current = null;
    }, 500);
  };
  
  const handleMicRelease = () => {
    if (prepareTimeoutRef.current) {
      clearTimeout(prepareTimeoutRef.current);
      prepareTimeoutRef.current = null;
    }

    if (isPreparing) {
      setIsPreparing(false);
      return;
    }
    
    if (isRecording) {
      setIsRecording(false);
      
      setIsTranscribing(true);
      
      setTimeout(() => {
        const mockTranscription = "Como faço pra apostar no próximo jogo do Flamengo?";
        setInput(mockTranscription);
        setIsTranscribing(false);
      }, 1500);
    }
  };

  const getInputPlaceholder = () => {
    if (isPreparing) return "Preparando...";
    if (isRecording) return "Gravando...";
    if (isTranscribing) return "Transcrevendo...";
    return "Curtiu? Quer saber mais? Fala aí!";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-secondary/30 backdrop-blur-sm pb-safe z-10">
      <div className="mx-auto max-w-2xl px-4 py-2 md:py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getInputPlaceholder()}
            className={cn(
              "w-full py-6 pl-4 pr-12 rounded-lg bg-white shadow-sm border-0 text-base",
              isPreparing && "animate-pulse text-amber-600",
              isRecording && "animate-pulse text-red-600",
              isTranscribing && "animate-pulse"
            )}
            readOnly={isPreparing || isRecording || isTranscribing}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {input.trim() ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : isTranscribing ? (
              <motion.div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors opacity-50"
                  disabled
                >
                  <span className="h-4 w-4 block rounded-full bg-muted-foreground/30 animate-pulse"></span>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors",
                    isPreparing && "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 hover:text-amber-600",
                    isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                  )}
                  onMouseDown={handleMicPress}
                  onMouseUp={handleMicRelease}
                  onTouchStart={handleMicPress}
                  onTouchEnd={handleMicRelease}
                  aria-label="Hold to record voice message"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
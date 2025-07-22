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
        const mockTranscription = "¿Cómo puedo apostar en el próximo partido del Real Madrid?";
        setInput(mockTranscription);
        setIsTranscribing(false);
      }, 1500);
    }
  };

  const getInputPlaceholder = () => {
    if (isPreparing) return "Preparando...";
    if (isRecording) return "Grabando...";
    if (isTranscribing) return "Transcribiendo...";
    return "¿Te gustó? ¿Quieres saber más? ¡Dímelo!";
  };

  const getMicButtonText = () => {
    if (isPreparing) return "Preparando...";
    if (isRecording) return "Suelta para enviar";
    if (isTranscribing) return "Transcribiendo...";
    return "Mantén presionado para hablar";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="pl-9 pr-4 py-2 rounded-lg border-2 focus:border-primary"
                disabled={isPreparing || isRecording || isTranscribing}
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isPreparing || isRecording || isTranscribing}
              className="rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            type="button"
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
              isPreparing || isRecording 
                ? "bg-primary text-primary-foreground scale-105" 
                : "bg-muted hover:bg-muted/80"
            )}
            whileTap={{ scale: 0.95 }}
            disabled={isTranscribing}
          >
            <Mic className={cn(
              "h-4 w-4",
              isRecording && "animate-pulse"
            )} />
            <span className="text-sm font-medium">
              {getMicButtonText()}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function FollowUpQuestionForm() {
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    console.log("Follow-up question submitted:", input);
    setInput(""); // Clear the input field
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-secondary/30 backdrop-blur-sm pb-safe z-10">
      <div className="mx-auto max-w-2xl px-4 py-2 md:py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Curtiu? Quer saber mais? Fala aí!"
            className="w-full py-6 pl-4 pr-12 rounded-lg bg-white shadow-sm border-0 text-base"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 hover:bg-secondary active:bg-secondary/80"
                disabled={!input.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
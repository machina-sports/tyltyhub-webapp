"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SportingbetDot } from "@/components/ui/dot";

export default function FollowUpQuestionForm() {
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Follow-up question submitted:", input);
    setInput(""); // Clear the input field
  };

  return (
    <div className="fixed md:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t mobile-safe-bottom">
      <div className="w-full max-w-[100vw] mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="w-full relative">
          <div className="relative flex items-center">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <SportingbetDot size={16} />
            </div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Curtiu? Quer saber mais? Fala aí!"
              className="w-full h-12 pl-10 pr-12 rounded-lg bg-secondary/50 border-0 focus-visible:ring-0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 hover:bg-transparent">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ArticleVotingProps {
  articleId: string
}

export function ArticleVoting({ articleId }: ArticleVotingProps) {
  const [votes, setVotes] = useState({ useful: 0, improvement: 0 })
  const { isDarkMode } = useTheme()

  const handleVote = (type: "useful" | "improvement") => {
    setVotes(prev => ({ ...prev, [type]: prev[type] + 1 }))
    // Add gtag event tracking for votes
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'article_vote', {
        event_category: 'article_voting',
        event_label: `Voted ${type}`,
        article_id: articleId,
        value: type === 'useful' ? 1 : 0,
      });
    }
  }

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold",
        isDarkMode ? "text-[#D3ECFF]" : ""
      )}>Esta análise foi útil?</h3>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleVote("useful")}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Útil ({votes.useful})
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleVote("improvement")}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Precisa Melhorar ({votes.improvement})
        </Button>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ArticleVotingProps {
  articleId: string
}

export function ArticleVoting({ articleId }: ArticleVotingProps) {
  const [votedFor, setVotedFor] = useState<"useful" | "improvement" | null>(
    null
  )
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVote = localStorage.getItem(`article-vote-${articleId}`)
      if (storedVote === "useful" || storedVote === "improvement") {
        setVotedFor(storedVote)
      }
    }
  }, [articleId])

  const handleVote = (type: "useful" | "improvement") => {
    const previousVote = votedFor

    if (previousVote === type) {
      // User is retracting their vote.
      setVotedFor(null)
      localStorage.removeItem(`article-vote-${articleId}`)

      // Send an event to cancel the previous vote.
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "article_vote", {
          article_id: articleId,
          vote_type: `unvote_${previousVote}`, // e.g. unvote_useful
          vote_score: previousVote === "useful" ? -1 : 1, // Opposite of the original vote's score
        })
      }
    } else {
      // User is casting a new vote or changing their vote.

      // First, if they are changing their vote, we must retract the old one.
      if (previousVote) {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "article_vote", {
            article_id: articleId,
            vote_type: `unvote_${previousVote}`,
            vote_score: previousVote === "useful" ? -1 : 1,
          })
        }
      }

      // Now, cast the new vote.
      setVotedFor(type)
      localStorage.setItem(`article-vote-${articleId}`, type)
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "article_vote", {
          article_id: articleId,
          vote_type: type,
          vote_score: type === "useful" ? 1 : -1,
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3
        className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-[#FFF8E1]" : ""
        )}
      >
        Esta análise foi útil?
      </h3>
      <div className="flex gap-4">
        <Button
          variant={votedFor === "useful" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleVote("useful")}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Útil
        </Button>
        <Button
          variant={votedFor === "improvement" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleVote("improvement")}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Precisa Melhorar
        </Button>
      </div>
    </div>
  )
}
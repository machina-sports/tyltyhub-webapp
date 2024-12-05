"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticleVotingProps {
  articleId: string
}

export function ArticleVoting({ articleId }: ArticleVotingProps) {
  const [votes, setVotes] = useState({ useful: 0, improvement: 0 })

  const handleVote = (type: "useful" | "improvement") => {
    setVotes(prev => ({ ...prev, [type]: prev[type] + 1 }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Was this analysis helpful?</h3>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleVote("useful")}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Useful ({votes.useful})
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleVote("improvement")}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Needs Improvement ({votes.improvement})
        </Button>
      </div>
    </div>
  )
}
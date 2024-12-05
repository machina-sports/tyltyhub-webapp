"use client"

import { cn } from '@/lib/utils'
import { BettingOddsBox } from './betting-odds-box'
import { RelatedArticles } from './article/related-articles'
import { Loader2 } from 'lucide-react'
import { ChatBubble } from './chat/bubble'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
  onNewMessage?: (message: { role: 'user' | 'assistant', content: string }) => void
  oddsType?: string | null // Add oddsType prop
}

const SAMPLE_ODDS = {
  "basketball": {
    "event": "Los Angeles Lakers vs Golden State Warriors",
    "markets": [
      {
        "name": "Money Line",
        "options": [
          { "name": "Lakers", "odds": "1.67" },
          { "name": "Warriors", "odds": "2.30" }
        ]
      }
    ]
  },
  "soccer": {
    "event": "Manchester City vs Real Madrid",
    "markets": [
      {
        "name": "Match Result",
        "options": [
          { "name": "Man City", "odds": "1.83" },
          { "name": "Real Madrid", "odds": "3.80" }
        ]
      }
    ]
  },
  "f1": {
    "event": "Monaco Grand Prix",
    "markets": [
      {
        "name": "Race Winner",
        "options": [
          { "name": "Lewis Hamilton", "odds": "2.50" },
          { "name": "Max Verstappen", "odds": "2.75" }
        ]
      }
    ]
  },
  "ufc": {
    "event": "UFC 312: Alex Pereira vs Jamal Hill 2",
    "markets": [
      {
        "name": "Fight Winner",
        "options": [
          { "name": "Alex Pereira", "odds": "2.10" },
          { "name": "Jamal Hill", "odds": "1.80" }
        ]
      }
    ]
  }
}

export function ChatMessage({ role, content, isTyping, onNewMessage, oddsType }: ChatMessageProps) {
  const showOdds = role === 'assistant' && !isTyping
  const showBetConfirmation = content.toLowerCase().includes('i\'ve placed your bet')

  const handlePlaceBet = (bet: any) => {
    if (onNewMessage) {
      // Add user message showing the bet details
      onNewMessage({
        role: 'user',
        content: `Bet $${bet.stake} on ${bet.selection} (${bet.odds}) - ${bet.event}`
      })
      
      // Add Bookie confirmation message
      onNewMessage({
        role: 'assistant',
        content: `I've placed your bet: $${bet.stake} on ${bet.selection} at ${bet.odds} for the ${bet.event}. Good luck! 🍀\n\nIs there anything else you'd like to know about this match?`
      })
    }
  }

  return (
    <div className="mb-4 last:mb-0">
      <ChatBubble role={role}>
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          ) : (
            content.split('\n').map((line, i) => (
              <p key={i} className="text-sm leading-relaxed">{line}</p>
            ))
          )}
        </div>
      </ChatBubble>
      
      {showOdds && oddsType && !showBetConfirmation && (
        <div className="mt-4 pl-14">
          <BettingOddsBox {...SAMPLE_ODDS[oddsType]} onPlaceBet={handlePlaceBet} />
          <div className="mt-6 -mx-4 md:mx-0">
            <RelatedArticles currentArticleId="" />
          </div>
        </div>
      )}
      <div className="h-8 md:hidden"></div> {/* Adjust height as needed */}
    </div>
  )
}
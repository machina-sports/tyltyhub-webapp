"use client"

import { cn } from '@/lib/utils'
import { BettingOddsBox } from './betting-odds-box'
import { RelatedArticles } from './article/related-articles'
import { Loader2 } from 'lucide-react'
import { ChatBubble } from './chat/bubble'
import { useChatState } from '@/hooks/use-chat-state'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
  onNewMessage?: (message: { role: 'user' | 'assistant', content: string, oddsType?: string | null }) => void
  oddsType?: string | null
}

interface OddsData {
  event: string;
  markets: {
    name: string;
    options: {
      name: string;
      odds: string;
    }[];
  }[];
}

interface SampleOddsType {
  [key: string]: OddsData;
}

const SAMPLE_ODDS: SampleOddsType = {
  "basketball": {
    "event": "Los Angeles Lakers vs Golden State Warriors",
    "markets": [
      {
        "name": "Resultado Final",
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
        "name": "Resultado da Partida",
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
        "name": "Vencedor da Corrida",
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
        "name": "Vencedor da Luta",
        "options": [
          { "name": "Alex Pereira", "odds": "2.10" },
          { "name": "Jamal Hill", "odds": "1.80" }
        ]
      }
    ]
  },
  "cwc-group-a": {
    "event": "Real Madrid vs Al Ahly",
    "markets": [
      {
        "name": "Resultado da Partida",
        "options": [
          { "name": "Real Madrid", "odds": "1.45" },
          { "name": "Al Ahly", "odds": "5.50" }
        ]
      }
    ]
  },
  "cwc-group-b": {
    "event": "Manchester City vs Flamengo",
    "markets": [
      {
        "name": "Resultado da Partida",
        "options": [
          { "name": "Man City", "odds": "1.60" },
          { "name": "Flamengo", "odds": "4.20" }
        ]
      }
    ]
  },
  "cwc-general": {
    "event": "Mundial de Clubes da FIFA 2025",
    "markets": [
      {
        "name": "Vencedor do Torneio",
        "options": [
          { "name": "Real Madrid", "odds": "2.10" },
          { "name": "Man City", "odds": "2.35" }
        ]
      }
    ]
  },
  "cwc-final": {
    "event": "Final do Mundial de Clubes da FIFA",
    "markets": [
      {
        "name": "Vencedor da Final",
        "options": [
          { "name": "Real Madrid", "odds": "2.10" },
          { "name": "Man City", "odds": "2.35" }
        ]
      }
    ]
  }
}

export function ChatMessage({ role, content, isTyping, onNewMessage, oddsType }: ChatMessageProps) {
  const { addMessage } = useChatState()
  const showOdds = role === 'assistant' && !isTyping
  const showBetConfirmation = content.toLowerCase().includes('i\'ve placed your bet')

  const handlePlaceBet = (bet: any) => {
    const messageHandler = onNewMessage || addMessage
    
    // Add user message showing the bet details
    messageHandler({
      role: 'user',
      content: `Aposta: $${bet.stake} em ${bet.selection} (${bet.odds}) - ${bet.event}`
    })
    
    // Add Bookie confirmation message
    messageHandler({
      role: 'assistant',
      content: `Sua aposta foi feita: $${bet.stake} em ${bet.selection} com odds ${bet.odds} para ${bet.event}. Boa sorte! 🍀\n\nQuer saber mais alguma coisa sobre esta partida?`
    })
  }

  return (
    <div className="mb-4 last:mb-0">
      <ChatBubble role={role}>
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </div>
          ) : (
            content.split('\n').map((line, i) => (
              <p key={i} className="text-sm leading-relaxed">{line}</p>
            ))
          )}
        </div>
      </ChatBubble>
      
      {showOdds && oddsType && !showBetConfirmation && SAMPLE_ODDS[oddsType] && (
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
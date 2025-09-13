"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, DollarSign, Loader2, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Market {
  name: string
  options: {
    name: string
    odds: string
  }[]
}

// Dummy data for betting markets
const DUMMY_MARKETS: Market[] = [
  {
    name: "Vencedor da Partida",
    options: [
      { name: "Time da Casa", odds: "+150" },
      { name: "Time Visitante", odds: "-120" }
    ]
  },
  {
    name: "Total de Pontos",
    options: [
      { name: "Mais de 2.5", odds: "-110" },
      { name: "Menos de 2.5", odds: "+105" }
    ]
  },
  {
    name: "Primeiro a Marcar",
    options: [
      { name: "Jogador A", odds: "+500" },
      { name: "Jogador B", odds: "+650" }
    ]
  }
]

interface BettingOddsBoxProps {
  event: string
  markets?: Market[]
  onPlaceBet: (bet: {
    event: string
    market: string
    selection: string
    odds: string
    stake: number
  }) => void
}

// Function to convert American odds to decimal format
const convertToDecimal = (odds: string): string => {
  const numOdds = parseFloat(odds);
  
  if (isNaN(numOdds)) return odds; // Return original if not a number
  
  if (numOdds > 0) {
    // Positive American odds: decimal = (american / 100) + 1
    return ((numOdds / 100) + 1).toFixed(2);
  } else {
    // Negative American odds: decimal = (100 / |american|) + 1
    return ((100 / Math.abs(numOdds)) + 1).toFixed(2);
  }
};

export function BettingOddsBox({ event, markets = DUMMY_MARKETS, onPlaceBet }: BettingOddsBoxProps) {
  const [selectedBet, setSelectedBet] = useState<{
    market: string
    selection: string
    odds: string
  } | null>(null)
  const [stake, setStake] = useState("")
  const [isPlacing, setIsPlacing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSelectOption = (market: string, option: { name: string, odds: string }) => {
    if (isCompleted) return
    
    // Track odds information viewing interest
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'odds_information_interest', {
        event_category: 'odds_information',
        event_action: 'view_betting_option_details',
        event_label: `${event} - ${market} - ${option.name}`,
        event_name: event,
        market_name: market,
        option_name: option.name,
        odds_value: option.odds
      });
    }

    setSelectedBet({
      market,
      selection: option.name,
      odds: option.odds
    })
    setShowConfirmation(true)
  }

  const handlePlaceBet = async () => {
    if (!selectedBet || !stake) return

    // Track educational interest in betting information
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'betting_education_interest', {
        event_category: 'betting_education',
        event_action: 'view_betting_calculation',
        event_label: `${event} - ${selectedBet.market} - ${selectedBet.selection}`,
        event_name: event,
        market_name: selectedBet.market,
        selection_name: selectedBet.selection,
        odds_value: selectedBet.odds,
        stake_amount: Number(stake),
        potential_winnings: Number(potentialWinnings)
      });
    }

    setIsPlacing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate educational demo - not real betting
    onPlaceBet({
      event,
      market: selectedBet.market,
      selection: selectedBet.selection,
      odds: selectedBet.odds,
      stake: Number(stake)
    })

    // Track educational demo completion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'betting_demo_completed', {
        event_category: 'betting_education',
        event_action: 'complete_betting_demo',
        event_label: `${event} - ${selectedBet.market} - ${selectedBet.selection}`,
        event_name: event,
        market_name: selectedBet.market,
        selection_name: selectedBet.selection,
        odds_value: selectedBet.odds,
        stake_amount: Number(stake),
        potential_winnings: Number(potentialWinnings)
      });
    }

    setIsCompleted(true)
    setIsPlacing(false)
  }

  const potentialWinnings = selectedBet && stake
    ? (Number(stake) * Math.abs(Number(selectedBet.odds))).toFixed(2)
    : "0.00"

  return (
    <Card className={cn(
      "p-4 md:p-6 bg-white shadow-md rounded-lg space-y-4 md:space-y-6 relative overflow-hidden",
      isCompleted && "opacity-75 pointer-events-none"
    )}>
      {isCompleted && (
        <div className="absolute inset-0 bg-gray-100/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <p className="text-base font-semibold text-gray-800 bg-white/80 py-3 px-6 rounded-full shadow-sm">
            Aposta Feita com Sucesso!
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-base md:text-lg text-gray-900">{event}</h3>
        {showConfirmation && !isCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Track educational navigation
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'betting_education_navigation', {
                  event_category: 'betting_education',
                  event_action: 'navigate_back_from_demo',
                  event_label: `${event} - Back from confirmation`
                });
              }
              
              setShowConfirmation(false)
              setSelectedBet(null)
            }}
            className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      {!showConfirmation ? (
        <div className="space-y-4">
            {markets && markets.length > 0 ? markets.map((market, index) => (
              <div key={index} className="space-y-2 md:space-y-3">
                <p className="text-sm md:text-base text-gray-600 font-medium">{market.name}</p>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {market.options.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={isCompleted}
                      className={cn(
                        "flex flex-col items-start gap-1 w-full py-3 md:py-4 px-3 md:px-5 rounded-md border border-gray-300 hover:border-gray-400 active:bg-gray-50",
                        selectedBet?.selection === option.name && "border-brand-primary bg-brand-primary/10"
                      )}
                      onClick={() => handleSelectOption(market.name, option)}
                    >
                      <span className="text-sm md:text-base font-semibold text-gray-800">{option.name}</span>
                      <span className="text-xs md:text-sm text-gray-500 font-mono">
                        {option.odds}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Nenhum mercado de aposta disponível</p>
            )}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5">
            <div className="bg-brand-primary/10 p-3 md:p-4 rounded-lg space-y-2 md:space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Seleção:</span>
                <span className="font-semibold text-gray-800">{selectedBet?.selection}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Odds:</span>
                <span className="font-mono text-gray-800">{selectedBet?.odds ? convertToDecimal(selectedBet.odds) : 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm md:text-base text-gray-600 font-medium">Valor da Aposta</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-500" />
                <Input
                  disabled={isCompleted}
                  type="number"
                  inputMode="decimal"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="pl-9 md:pl-10 border-gray-300 focus:border-brand-primary h-10 md:h-12 text-base"
                  placeholder="Digite o valor da aposta"
                />
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Ganho Potencial:</span>
                <span className="font-mono text-gray-800">${potentialWinnings}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-brand-primary text-black hover:bg-brand-secondary h-12 text-base font-medium"
              disabled={!stake || isPlacing || isCompleted}
              onClick={handlePlaceBet}
            >
              {isPlacing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Fazer Aposta
                </>
              )}
            </Button>
        </div>
      )}
    </Card>
  )
}
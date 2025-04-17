"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, DollarSign, Loader2 } from "lucide-react"
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
    name: "Match Winner",
    options: [
      { name: "Home Team", odds: "+150" },
      { name: "Away Team", odds: "-120" }
    ]
  },
  {
    name: "Total Points",
    options: [
      { name: "Over 2.5", odds: "-110" },
      { name: "Under 2.5", odds: "+105" }
    ]
  },
  {
    name: "First Goal Scorer",
    options: [
      { name: "Player A", odds: "+500" },
      { name: "Player B", odds: "+650" }
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
    setSelectedBet({
      market,
      selection: option.name,
      odds: option.odds
    })
    setShowConfirmation(true)
  }

  const handlePlaceBet = async () => {
    if (!selectedBet || !stake) return

    setIsPlacing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onPlaceBet({
      event,
      market: selectedBet.market,
      selection: selectedBet.selection,
      odds: selectedBet.odds,
      stake: Number(stake)
    })

    setIsCompleted(true)
    setIsPlacing(false)
  }

  const potentialWinnings = selectedBet && stake
    ? (Number(stake) * Math.abs(Number(selectedBet.odds))).toFixed(2)
    : "0.00"

    return (
      <Card className={cn(
        "p-6 bg-white shadow-md rounded-lg space-y-6 relative",
        isCompleted && "opacity-75 pointer-events-none"
      )}>
        {isCompleted && (
          <div className="absolute inset-0 bg-gray-100/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <p className="text-base font-semibold text-gray-800">Bet Placed Successfully</p>
          </div>
        )}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-lg text-gray-900">{event}</h3>
          {showConfirmation && !isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowConfirmation(false)
                setSelectedBet(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </Button>
          )}
        </div>
  
        {!showConfirmation ? (
          <div className="space-y-4">
            {markets && markets.length > 0 ? markets.map((market, index) => (
              <div key={index} className="space-y-3">
                <p className="text-base text-gray-600">{market.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  {market.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      disabled={isCompleted}
                      className={cn(
                        "h-auto py-4 px-5 border-gray-300 hover:border-gray-400",
                        selectedBet?.selection === option.name && "border-blue-500"
                      )}
                      onClick={() => handleSelectOption(market.name, option)}
                    >
                      <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-base font-semibold text-gray-800">{option.name}</span>
                        <span className="text-sm text-gray-500 font-mono">
                          {option.odds}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No betting markets available</p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Selection:</span>
                <span className="font-semibold text-gray-800">{selectedBet?.selection}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Odds:</span>
                <span className="font-mono text-gray-800">{selectedBet?.odds}</span>
              </div>
            </div>
  
            <div className="space-y-3">
              <label className="text-base text-gray-600">Stake Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  disabled={isCompleted}
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500"
                  placeholder="Enter stake amount"
                />
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Potential Win:</span>
                <span className="font-mono text-gray-800">${potentialWinnings}</span>
              </div>
            </div>
  
            <Button 
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={!stake || isPlacing || isCompleted}
              onClick={handlePlaceBet}
            >
              {isPlacing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Placing Bet...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Place Bet
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    )
  }
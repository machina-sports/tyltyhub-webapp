"use client"

import React, { useState } from "react"

import { Loader2, Star, TrendingUp, X, Check, CheckCircle2 } from "lucide-react"

import { doPlaceBet } from '@/providers/threads/actions'

import { setItemStatus } from '@/providers/threads/reducer'

import { useAppDispatch } from '@/store/dispatch'

import { useGlobalState } from '@/store/useState'

export const BetBox = ({ bet }: { bet: any }) => {
  
  const dispatch = useAppDispatch()
  
  const state = useGlobalState((state: any) => state.threads)
  
  const [isLoading, setIsLoading] = useState(false)
  
  const [isOpen, setIsOpen] = useState(false)
  
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [stake, setStake] = useState("")

  // Calculate potential profit
  const potentialProfit = stake ? parseFloat(stake) * parseFloat(bet.bet_odd) - parseFloat(stake) : 0

  const handlePlaceBet = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    
    // Track bet placement attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'bet_place_attempt', {
        event_category: 'bet_box',
        event_action: 'attempt_place_bet',
        event_label: `${bet.bet_title} - ${bet.runner_name}`,
        bet_title: bet.bet_title,
        runner_name: bet.runner_name,
        bet_odd: parseFloat(bet.bet_odd),
        stake_amount: parseFloat(stake),
        potential_profit: potentialProfit,
        thread_id: state.item.data._id
      });
    }
    
    doPlaceBet({ 
      thread_id: state.item.data._id,
      bet_amount: parseFloat(stake),
      bet_name: bet.bet_title,
      bet_odd: parseFloat(bet.bet_odd),
      runner_name: bet.runner_name,
    })
      .then(() => {
        // Track successful bet placement
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'bet_place_success', {
            event_category: 'bet_box',
            event_action: 'successful_bet_placement',
            event_label: `${bet.bet_title} - ${bet.runner_name}`,
            bet_title: bet.bet_title,
            runner_name: bet.runner_name,
            bet_odd: parseFloat(bet.bet_odd),
            stake_amount: parseFloat(stake),
            potential_profit: potentialProfit,
            thread_id: state.item.data._id,
            value: parseFloat(stake)
          });
        }
        
        setStake("")
        setIsOpen(false)
        setIsSuccess(true)
        dispatch(setItemStatus('waiting'))
      })
      .catch((error) => {
        console.error('Failed to place bet:', error)
        
        // Track bet placement error
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'bet_place_error', {
            event_category: 'bet_box',
            event_action: 'bet_placement_error',
            event_label: `${bet.bet_title} - ${bet.runner_name} - ${error.message || 'Unknown error'}`,
            bet_title: bet.bet_title,
            runner_name: bet.runner_name,
            error_message: error.message || 'Unknown error'
          });
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && stake && !isLoading) {
      handlePlaceBet(e as any)
    }
  }

  const handleOpen = () => {
    if (!isOpen && !isLoading) {
      // Track bet box open
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bet_box_open', {
          event_category: 'bet_box',
          event_action: 'open_bet_box',
          event_label: `${bet.bet_title} - ${bet.runner_name}`,
          bet_title: bet.bet_title,
          runner_name: bet.runner_name,
          bet_odd: parseFloat(bet.bet_odd)
        });
      }
      
      setIsOpen(true)
      setIsSuccess(false)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && !isLoading) {
      // Track bet box close
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bet_box_close', {
          event_category: 'bet_box',
          event_action: 'close_bet_box',
          event_label: `${bet.bet_title} - ${bet.runner_name}`,
          bet_title: bet.bet_title,
          runner_name: bet.runner_name,
          had_stake: stake !== ""
        });
      }
      
      setIsOpen(false);
    }
  };

  return (
    <div
      onClick={handleOpen}
      className={`group border border-muted-foreground/20 rounded-md px-2 pl-4 py-3 max-w-lg transition-all ${!isOpen ? 'hover:bg-muted/50 cursor-pointer' : ''
        } ${isLoading ? 'animate-pulse bg-muted/20' : ''}`}
    >
      <div className="flex flex-row">
        <div
          className="flex flex-col items-center justify-center ml-2 mr-5"
          onClick={handleClose}
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isSuccess ? (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          ) : isOpen ? (
            <X className="h-6 w-6 cursor-pointer" />
          ) : (
            <Star className="h-6 w-6 group-hover:text-yellow-400 transition-colors" />
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className={`flex flex-row justify-between ${!isOpen ? 'group-hover:text-primary' : ''} transition-colors`}>
            <span className="font-bold">{bet.bet_title}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-muted-foreground/60">{bet.runner_name}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center ml-2 min-w-16">
          <TrendingUp className="h-6 w-6" />
          <span className="text-md font-bold">{bet.bet_odd}</span>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 mr-2 border-t pt-4 border-muted-foreground/20">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 pt-11 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-8 pr-4 py-2 bg-background border rounded-md max-w-40"
                  placeholder="Enter stake"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Profit: ${potentialProfit.toFixed(2)}
            </div>
            <button
              disabled={isLoading || !stake}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlaceBet}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Place Bet'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
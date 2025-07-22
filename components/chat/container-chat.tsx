"use client"

import { useState, useEffect, useRef } from "react"

import { Send, Share2, X, MessageCircle, Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { actionChat } from "@/providers/threads/actions"
import { actionSaveSharedChat } from "@/providers/share/actions"

import { ChatMessage } from "../chat-message"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import { TableSkeleton } from "../skeleton"
import { Loading } from "../ui/loading"
import { cn } from "@/lib/utils"
import { trackNewMessage } from "@/lib/analytics"

import { AppState } from "@/store"

export function ContainerChat() {
  const state = useGlobalState((state: any) => state.threads)
  const shareState = useGlobalState((state: AppState) => state.share)

  const dispatch = useAppDispatch()

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [expirationDays, setExpirationDays] = useState<number>(7)
  const [isSaving, setIsSaving] = useState(false)

  const [input, setInput] = useState('')

  const messageContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isUserNearBottom, setIsUserNearBottom] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSendMessage(input, true)
    setInput('')
  }

  // Función simple para scroll
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Detectar si usuario está cerca del final
  const handleScroll = () => {
    if (!messageContainerRef.current) return
    
    const container = messageContainerRef.current
    const threshold = 100 // pixels from bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    
    setIsUserNearBottom(isNearBottom)
  }

  const handleSendMessage = async (message: string, shouldScroll = false) => {
    trackNewMessage(message)
    // shouldScroll = true cuando usuario escribe manualmente
    // shouldScroll = false cuando hace clic en sugerencias (no debe hacer scroll)
    if (shouldScroll) {
      setIsUserNearBottom(true)
    }
    dispatch(actionChat({ thread_id: state.item.data?._id, message }))
  }
  
  const handleOpenShareDialog = () => {
    const threadData = state.item.data
    if (threadData) {
      try {
        setIsSaving(true)
        
        dispatch(actionSaveSharedChat({
          chatData: threadData,
          expirationDays
        })).unwrap()
          .then((result) => {
            const baseUrl = "https://bwinbot.com"
            const shareLink = `${baseUrl}/chat/${result.chatId}`
            setShareUrl(shareLink)
            setIsSaving(false)
            setShareDialogOpen(true)
          })
          .catch((error) => {
            console.error('Error al generar enlace de compartir:', error)
            setIsSaving(false)
          })
      } catch (error) {
        console.error('Error al iniciar compartir:', error)
        setIsSaving(false)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  const handleShare = async (platform?: string) => {
    if (platform === 'whatsapp') {
      const shareText = 'Mira este chat de bwinBOT'
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank')
      return
    }
      
    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')
      return
    }
    
    if (navigator.share) {
      const firstMessage = state.item.data?.value?.messages?.[0]?.content || 'Chat Thread'
      try {
        await navigator.share({
          title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : ''),
          text: 'Mira este chat de bwin Copa Mundial de Clubes',
          url: shareUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  const currentMessages = state.item.data?.value?.messages || []
  const currentStatus = state.item.data?.value?.status
  const currentStatusMessage = state.item.data?.value?.["status-message"]
  const isTyping = currentStatus === "processing" || currentStatus === "waiting" || state.fields.status === "loading"
  const isLoading = state.item.status === 'loading'

  // Scroll cuando hay nuevos mensajes (solo si usuario está cerca del final)
  useEffect(() => {
    if (isUserNearBottom && currentMessages.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [currentMessages.length, isUserNearBottom])

  // Scroll cuando bot está escribiendo (solo si usuario está cerca del final)
  useEffect(() => {
    if (isUserNearBottom && currentStatusMessage && isTyping) {
      scrollToBottom()
    }
  }, [currentStatusMessage, isTyping, isUserNearBottom])

  return (
    <>
      {/* Main heading for SEO - visually hidden but accessible */}
      <h1 className="sr-only">La Inteligencia Artificial de bwin</h1>
      
      {/* Share button section */}
      <div className="sticky top-0 z-10 px-4 py-2 flex justify-end items-center border-b bg-bwin-neutral-10 border-bwin-neutral-30">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10"
          onClick={handleOpenShareDialog}
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="w-[94%] max-w-[94%] sm:max-w-[625px] overflow-y-auto max-h-[90vh] p-4 sm:p-6 bg-bwin-neutral-10 border-bwin-neutral-30 text-bwin-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-bwin-neutral-100">Enlace público actualizado</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 border rounded-md px-3 py-3 border-bwin-neutral-30 bg-bwin-neutral-20 text-bwin-neutral-100">
              <span className="text-sm break-all sm:truncate sm:flex-1 pb-2 sm:pb-0">{shareUrl || 'URL no disponible'}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyLink}
                className="shrink-0 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10" 
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> 
                    <span>Copiar enlace</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-16 sm:h-20 space-y-2 py-3 bg-bwin-neutral-20 border-bwin-neutral-30 text-bwin-neutral-100 hover:bg-bwin-neutral-30"
              onClick={() => handleShare('whatsapp')}
            >
              <div className="h-12 w-12 rounded-full bg-[#25d366] flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-16 sm:h-20 space-y-2 py-3 bg-bwin-neutral-20 border-bwin-neutral-30 text-bwin-neutral-100 hover:bg-bwin-neutral-30"
              onClick={() => handleShare('x')}
            >
              <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                <X className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium">Twitter</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div 
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" 
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto space-y-6 pb-[160px] md:pb-[120px]">
          <div className="space-y-3 sm:space-y-6 pt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loading width={60} height={60} />
              </div>
            ) : (
              <>
                {currentMessages.map((message: any, index: number) => (
                  <ChatMessage
                    key={index}
                    {...message}
                    isTyping={false}
                    onNewMessage={handleSendMessage}
                  />
                ))}
                {isTyping && (
                  <ChatMessage
                    role="assistant"
                    content={currentStatusMessage}
                    isTyping={true}
                    onNewMessage={handleSendMessage}
                  />
                )}
              </>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed md:sticky bottom-0 left-0 right-0 bg-bwin-neutral-10/90 backdrop-blur-sm border-t border-bwin-neutral-30 p-4 pb-6 md:p-0 md:pb-4 mobile-safe-bottom">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative tap-highlight-none md:mt-2">
          <Input
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Conversa con bwinBOT..."
            className="w-full h-12 pl-4 pr-12 rounded-lg bg-bwin-neutral-20 text-bwin-neutral-100 placeholder:text-bwin-neutral-60 border border-bwin-neutral-30 focus:border-bwin-brand-primary focus:ring-0 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
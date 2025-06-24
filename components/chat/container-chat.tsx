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
import { useTheme } from "@/components/theme-provider"

import { useGlobalState } from "@/store/useState"

import { TableSkeleton } from "../skeleton"
import { Loading } from "../ui/loading"
import { cn } from "@/lib/utils"
import { trackNewMessage } from "@/lib/analytics"

import { AppState } from "@/store"

export function ContainerChat() {
  const { isDarkMode } = useTheme() 

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

  // Função simples para scroll
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Detectar se usuário está próximo do final
  const handleScroll = () => {
    if (!messageContainerRef.current) return
    
    const container = messageContainerRef.current
    const threshold = 100 // pixels from bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    
    setIsUserNearBottom(isNearBottom)
  }

  const handleSendMessage = async (message: string, shouldScroll = false) => {
    trackNewMessage(message)
    // shouldScroll = true quando usuário digita manualmente
    // shouldScroll = false quando clica em sugestões (não deve fazer scroll)
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
            const baseUrl = window.location.origin
            const shareLink = `${baseUrl}/chat/${result.chatId}`
            setShareUrl(shareLink)
            setIsSaving(false)
            setShareDialogOpen(true)
          })
          .catch((error) => {
            console.error('Erro ao gerar link de compartilhamento:', error)
            setIsSaving(false)
          })
      } catch (error) {
        console.error('Erro ao iniciar compartilhamento:', error)
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
      const shareText = 'Veja este chat do SportingBOT'
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
          text: 'Veja este chat do Sportingbet CWC',
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

  // Scroll quando há novas mensagens (apenas se usuário está próximo do final)
  useEffect(() => {
    if (isUserNearBottom && currentMessages.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [currentMessages.length, isUserNearBottom])

  // Scroll quando bot está digitando (apenas se usuário está próximo do final)
  useEffect(() => {
    if (isUserNearBottom && currentStatusMessage && isTyping) {
      scrollToBottom()
    }
  }, [currentStatusMessage, isTyping, isUserNearBottom])

  return (
    <>
      {/* Main heading for SEO - visually hidden but accessible */}
      <h1 className="sr-only">A Inteligência Artificial da Sportingbet</h1>
      
      {/* Share button section */}
      <div className={cn(
        "sticky top-0 z-10 px-4 py-2 flex justify-end items-center border-b",
        isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "bg-background/80 backdrop-blur-sm border-slate-200"
      )}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1",
            isDarkMode && "text-[#45CAFF] hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10"
          )}
          onClick={handleOpenShareDialog}
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className={cn(
          "w-[94%] max-w-[94%] sm:max-w-[625px] overflow-y-auto max-h-[90vh] p-4 sm:p-6", 
          isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30 text-white"
        )}>
          <DialogHeader>
            <DialogTitle className={cn("text-lg font-semibold", isDarkMode && "text-white")}>Link público atualizado</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:space-x-2 border rounded-md px-3 py-3", 
              isDarkMode ? "border-[#45CAFF]/30 bg-[#061F3F] text-white" : "bg-secondary"
            )}>
              <span className="text-sm break-all sm:truncate sm:flex-1 pb-2 sm:pb-0">{shareUrl || 'URL indisponível'}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyLink}
                className={cn(
                  "shrink-0", 
                  isDarkMode && "text-[#45CAFF] hover:text-white hover:bg-[#45CAFF]/10"
                )} 
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> 
                    <span>Copiar link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              variant="outline" 
              className={cn(
                "flex flex-col items-center justify-center h-16 sm:h-20 space-y-2 py-3", 
                isDarkMode ? "bg-[#25d366] border-[#25d366] text-white hover:bg-[#25d366]/10 hover:text-[#fff]" : ""  
              )}
              onClick={() => handleShare('whatsapp')}
            >
              <div className="h-12 w-12 rounded-full bg-[#25d366] flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </Button>
            
            <Button 
              variant="outline" 
              className={cn(
                "flex flex-col items-center justify-center h-16 sm:h-20 space-y-2 py-3", 
                isDarkMode ? "bg-[#0077b5] border-[#0077b5] text-white hover:bg-[#0077b5]/10 hover:text-[#fff]" : "" 
              )}
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

      <div className={cn(
        "fixed md:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 pb-6 md:p-0 md:pb-4 mobile-safe-bottom",
        isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : ""
      )}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative tap-highlight-none md:mt-2">
          <Input
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Converse com o SportingBOT..."
            className={cn(
              "w-full h-12 pl-4 pr-12 rounded-lg",
              isDarkMode 
                ? "bg-[#051A35] text-[#D3ECFF] placeholder:text-[#D3ECFF]/50 border border-[#45CAFF]/30 focus:border-[#45CAFF]/50 transition-colors" 
                : "bg-secondary border-0"
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className={cn(
                "h-8 w-8",
                isDarkMode && "text-[#45CAFF] hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
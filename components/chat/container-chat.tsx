"use client"

import { useState, useEffect, useRef } from "react"

import { Send, Share2, X, Linkedin, Check, Copy } from "lucide-react"

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

  // const [thread, setThread] = useState<any>(objectData)

  const [input, setInput] = useState('')

  const messageContainerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!input.trim()) return

    handleSendMessage(input)

    setInput('')
  }

  // Ref para o elemento que marca o final das mensagens
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Função para fazer scroll suave para o final
  const scrollToBottom = (smooth = true) => {
    // Método principal usando scrollIntoView
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      })
    }
    
    // Fallback para container pai com detecção mobile/desktop
    if (messageContainerRef.current) {
      const container = messageContainerRef.current
      const scrollTop = container.scrollHeight - container.clientHeight
      const isMobile = window.innerWidth < 768
      const extraOffset = isMobile ? 50 : 20 // Mobile: 50px, Desktop: 20px
      
      if (smooth) {
        container.scrollTo({
          top: scrollTop + extraOffset,
          behavior: 'smooth'
        })
      } else {
        container.scrollTop = scrollTop + extraOffset
      }
    }
    
    // Extra fallback para garantir scroll completo
    const isMobile = window.innerWidth < 768
    const timeoutDelay = isMobile ? (smooth ? 300 : 50) : (smooth ? 200 : 30)
    
    setTimeout(() => {
      if (messageContainerRef.current) {
        const container = messageContainerRef.current
        container.scrollTop = container.scrollHeight
      }
    }, timeoutDelay)
  }

  const handleSendMessage = async (message: string) => {
    trackNewMessage(message)
    // Forçar scroll para baixo imediatamente e manter ativo
    setShouldAutoScroll(true)
    scrollToBottom(false)
    
    dispatch(actionChat({ thread_id: state.item.data?._id, message }))
    
    // Scroll adicional após dispatch para garantir
    setTimeout(() => {
      setShouldAutoScroll(true)
      scrollToBottom(true)
    }, 50)
  }
  
  const handleOpenShareDialog = () => {
    const threadData = state.item.data
    if (threadData) {
      try {
        setIsSaving(true)
        
        // Usa a action do Redux em vez do serviço diretamente
        dispatch(actionSaveSharedChat({
          chatData: threadData,
          expirationDays
        })).unwrap()
          .then((result) => {
            // Após salvar com sucesso, gera o link de compartilhamento
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
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
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
          text: 'Veja este chat do SportingBet CWC',
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

  // Intersection Observer para detectar quando o usuário está no final
  useEffect(() => {
    if (!messagesEndRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        // Não desabilitar auto-scroll se o bot estiver digitando
        if (!isTyping) {
          setShouldAutoScroll(entry.isIntersecting)
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Considera como "no final" mesmo 50px antes
      }
    )

    observer.observe(messagesEndRef.current)
    return () => observer.disconnect()
  }, [isTyping])

  // Scroll automático apenas se shouldAutoScroll for true
  useEffect(() => {
    if (shouldAutoScroll && state.item.data?.value?.messages?.length > 0) {
      setTimeout(() => scrollToBottom(true), 100)
    }
  }, [state.item.data?.value?.messages?.length, shouldAutoScroll])

  // Scroll quando começa a digitar - MELHORADO
  useEffect(() => {
    if (isTyping && shouldAutoScroll) {
      // Scroll imediato quando começa a digitar
      scrollToBottom(false)
      // Scroll suave logo após
      setTimeout(() => scrollToBottom(true), 100)
    }
  }, [isTyping, shouldAutoScroll])

  // Scroll quando o conteúdo da mensagem de status muda - MELHORADO
  useEffect(() => {
    if (currentStatusMessage && isTyping && shouldAutoScroll) {
      // Scroll mais frequente durante a digitação
      scrollToBottom(true)
    }
  }, [currentStatusMessage, isTyping, shouldAutoScroll])

  // Scroll quando o chat termina de processar (status muda para idle)
  useEffect(() => {
    if (currentStatus === "idle" && shouldAutoScroll) {
      setTimeout(() => scrollToBottom(true), 300)
    }
  }, [currentStatus, shouldAutoScroll])

  // NOVO: Effect específico para scroll contínuo durante digitação
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;
    
    if (isTyping && shouldAutoScroll) {
      // Forçar scroll contínuo enquanto está digitando
      scrollInterval = setInterval(() => {
        scrollToBottom(true)
      }, 500) // Scroll a cada 500ms durante a digitação
    }
    
    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
      }
    }
  }, [isTyping, shouldAutoScroll])

  const isLoading = state.item.status === 'loading'

  

  return (
    <>
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
                isDarkMode ? "bg-[#0077b5] border-[#0077b5] text-white hover:bg-[#0077b5]/10 hover:text-[#fff]" : ""  
              )}
              onClick={() => handleShare('linkedin')}
            >
              <div className="h-12 w-12 rounded-full bg-[#0077b5] flex items-center justify-center">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium">LinkedIn</span>
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

     <div className="flex-1 min-h-0 overflow-y-auto" ref={messageContainerRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-[160px] md:pb-[120px]">
          <div className="space-y-3 sm:space-y-6 pt-4">
            {isLoading ? (
              <TableSkeleton isLoading={true} length={5} />
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
          {/* Elemento invisível para marcar o final das mensagens */}
          <div ref={messagesEndRef} className="h-20 md:h-16" />
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
            placeholder="Continue a conversa com o SportingBOT..."
            className={cn(
              "w-full h-12 pl-4 pr-12 rounded-lg",
              isDarkMode 
                ? "bg-[#061F3F] text-[#D3ECFF] placeholder:text-[#D3ECFF]/50 border border-[#45CAFF]/30 focus:border-[#45CAFF]/50 transition-colors" 
                : "bg-secondary/50 border-0"
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
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

export function ContainerChat() {
  const { isDarkMode } = useTheme() 

  const state = useGlobalState((state: any) => state.threads)
  const shareState = useGlobalState((state: any) => state.share)

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

  const handleSendMessage = async (message: string) => {
    trackNewMessage(message)
    dispatch(actionChat({ thread_id: state.item.data?._id, message }))
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
          .then((chatId) => {
            // Após salvar com sucesso, gera o link de compartilhamento
            const baseUrl = window.location.origin
            const shareLink = `${baseUrl}/chat/${chatId}`
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

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [state.item.data])

  const currentMessages = state.item.data?.value?.messages || []

  const currentStatus = state.item.data?.value?.status

  const currentStatusMessage = state.item.data?.value?.["status-message"]

  const isTyping = currentStatus === "processing" || currentStatus === "waiting" || state.fields.status === "loading"

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
          "sm:max-w-[625px]", 
          isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30 text-white"
        )}>
          <DialogHeader>
            <DialogTitle className={cn("text-lg font-semibold", isDarkMode && "text-white")}>Link público atualizado</DialogTitle>
            <DialogDescription className={cn("text-sm", isDarkMode && "text-gray-300")}>
              O link público para seu chat foi atualizado. Gerencie chats compartilhados através das configurações.
            </DialogDescription>
          </DialogHeader>
          


          <div className="mt-4 space-y-4">
            <div className={cn(
              "flex items-center space-x-2 border rounded-md px-3 py-2", 
              isDarkMode ? "border-[#45CAFF]/30 bg-[#061F3F] text-white" : "bg-secondary"
            )}>
              <span className="text-sm truncate flex-1">{shareUrl}</span>
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
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button 
              variant="outline" 
              className={cn(
                "flex flex-col items-center justify-center h-20 space-y-1", 
                isDarkMode && "border-[#45CAFF]/30 text-white hover:bg-[#45CAFF]/10"
              )}
              onClick={() => handleShare('linkedin')}
            >
              <div className="h-10 w-10 rounded-full bg-[#0077b5] flex items-center justify-center">
                <Linkedin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">LinkedIn</span>
            </Button>
            
            <Button 
              variant="outline" 
              className={cn(
                "flex flex-col items-center justify-center h-20 space-y-1", 
                isDarkMode && "border-[#45CAFF]/30 text-white hover:bg-[#45CAFF]/10"
              )}
              onClick={() => handleShare('x')}
            >
              <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                <X className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">X</span>
            </Button>
            
            <Button 
              variant="outline" 
              className={cn(
                "flex flex-col items-center justify-center h-20 space-y-1", 
                isDarkMode && "border-[#45CAFF]/30 text-white hover:bg-[#45CAFF]/10"
              )}
              onClick={() => setShareDialogOpen(false)}
            >
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <X className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-xs">Fechar</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

     <div className="flex-1 min-h-0 overflow-y-auto" ref={messageContainerRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-[24px]">
          <div className="space-y-3 sm:space-y-6">
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
        </div>
      </div>

      <div className={cn(
        "fixed md:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 mobile-safe-bottom",
        isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : ""
      )}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative tap-highlight-none md:mt-4">
          <Input
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Continue a conversa aqui..."
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
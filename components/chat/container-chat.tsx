"use client"

import { useEffect, useRef, useState } from "react"

import { Check, Copy, MessageCircle, Share2, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useBrandConfig } from "@/contexts/brand-context"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { actionSaveSharedChat } from "@/providers/share/actions"

import { ChatMessage } from "../chat-message"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import { Loading } from "../ui/loading"

import { AppState } from "@/store"

interface ContainerChatProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onNewMessage: (message: string, shouldScroll?: boolean) => void
}

export function ContainerChat({ input, setInput, onSubmit, onNewMessage }: ContainerChatProps) {
  const state = useGlobalState((state: any) => state.threads)
  const shareState = useGlobalState((state: AppState) => state.share)
  const brand = useBrandConfig()

  const dispatch = useAppDispatch()

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [expirationDays, setExpirationDays] = useState<number>(7)
  const [isSaving, setIsSaving] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
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
            const baseUrl = brand.baseUrl
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
      const shareText = `Mira este chat de ${brand.displayName}`
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
          text: `Mira este chat de ${brand.displayName}`,
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (currentMessages.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [currentMessages.length])

  // Scroll cuando hay nuevos mensajes (solo si usuario está cerca del final)
  useEffect(() => {
    if (currentMessages.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [currentMessages.length])

  // Scroll cuando bot está escribiendo (solo si usuario está cerca del final)
  useEffect(() => {
    if (currentStatusMessage && isTyping) {
      scrollToBottom()
    }
  }, [currentStatusMessage, isTyping])

  return (
    <>
      {/* Botão Share - apenas no desktop (no mobile está no header) */}
      <div className="hidden md:flex justify-end items-center border-b pb-4 mt-4" style={{ 
        borderColor: 'hsl(var(--brand-primary) / 0.2)'
      }}>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 hover:text-neutral-100 hover:bg-brand-primary/10 share-button-text"
          style={{ color: 'hsl(var(--brand-primary))' }}
          onClick={handleOpenShareDialog}
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </div>
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
                className="shrink-0 text-brand-primary hover:text-bwin-neutral-100 hover:bg-brand-primary/10"
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
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-auto"
      >
        <div className="max-w-3xl mx-auto space-y-6 pb-6">
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
                    onNewMessage={onNewMessage}
                  />
                ))}
                {isTyping && (
                  <ChatMessage
                    role="assistant"
                    content={currentStatusMessage}
                    isTyping={true}
                    onNewMessage={onNewMessage}
                  />
                )}
              </>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>


    </>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { actionSaveSharedChat } from "@/providers/share/actions"
import { AppState } from "@/store"
import { useAppDispatch } from "@/store/dispatch"
import { useGlobalState } from "@/store/useState"
import { Check, Copy, MessageCircle, Share2, X } from "lucide-react"
import { useState } from "react"

export function ShareIconButton() {
  const state = useGlobalState((state: any) => state.threads)
  const shareState = useGlobalState((state: AppState) => state.share)
  const dispatch = useAppDispatch()

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [expirationDays, setExpirationDays] = useState<number>(7)
  const [isSaving, setIsSaving] = useState(false)

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
          text: 'Mira este chat de bwin LaLiga',
          url: shareUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10"
        onClick={handleOpenShareDialog}
        disabled={isSaving}
        aria-label="Compartir"
      >
        <Share2 className="h-4 w-4" />
      </Button>

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
    </>
  )
}

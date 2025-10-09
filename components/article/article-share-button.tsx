"use client"

import { useState } from "react"
import { Share2, MessageCircle, Instagram, Facebook, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface ArticleShareButtonProps {
  articleId: string
  title: string
  url?: string
  shareImageUrl?: string
  iconOnly?: boolean
}

export function ArticleShareButton({ 
  articleId, 
  title, 
  url, 
  shareImageUrl, 
  iconOnly = false 
}: ArticleShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Generate full URL if only articleId is provided
  const fullUrl = url || `https://sportingbot.com/discover/${articleId}`
  const shareText = `Confira este artigo: ${title}`
  const shareImage = shareImageUrl || ''

  const handleShare = (platform: string) => {
    let shareUrl = ''
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}&picture=${encodeURIComponent(shareImage)}`
        break
      case 'instagram':
        // Instagram doesn't have a direct share URL so we'll copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${fullUrl}`)
          toast({
            title: "Link copiado!",
            description: "Cole o link no Instagram para compartilhar."
          })
        } else {
          toast({
            title: "Erro ao copiar",
            description: "Não foi possível copiar o link automaticamente."
          })
        }
        return
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullUrl)
          toast({
            title: "Link copiado!",
            description: "O link do artigo foi copiado para a área de transferência."
          })
        } else {
          toast({
            title: "Erro ao copiar",
            description: "Não foi possível copiar o link automaticamente."
          })
        }
        return
      default:
        // Native share API if supported
        if (navigator.share) {
          navigator.share({
            title: title,
            text: shareText,
            url: fullUrl,
          }).catch(err => console.error('Error sharing:', err))
          return
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (iconOnly) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 p-2 text-brand-primary hover:text-bwin-neutral-100 hover:bg-brand-primary/10"
            aria-label="Compartilhar artigo"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
              <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('instagram')} className="cursor-pointer">
              <Instagram className="mr-2 h-4 w-4 text-pink-600" />
              Instagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
              <LinkIcon className="mr-2 h-4 w-4" />
              Copiar link
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Versão com texto (fallback)
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
              <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('instagram')} className="cursor-pointer">
              <Instagram className="mr-2 h-4 w-4 text-pink-600" />
              Instagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
              <LinkIcon className="mr-2 h-4 w-4" />
              Copiar link
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

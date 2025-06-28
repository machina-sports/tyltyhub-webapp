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

interface ArticleSharingProps {
  articleId: string
  title: string
  url?: string
  shareImageUrl?: string
}

export function ArticleSharing({ articleId, title, url, shareImageUrl }: ArticleSharingProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Generate full URL if only articleId is provided
  const fullUrl = url || `https://sportingbot.com/discover/${articleId}`
  
  const shareText = `Confira este artigo: ${title}`
  const shareImage = shareImageUrl || `https://sportingbot.com/og_image_4.png`
  
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

  return (
    <div className="flex items-center gap-2">
      {/* Floating Share Button - Visible on larger screens */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
              <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('instagram')}>
              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
              <span>Instagram</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')}>
              <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span>Copiar link</span>
            </DropdownMenuItem>
            {/* Native share button for mobile */}
            {typeof navigator.share === 'function' && (
              <DropdownMenuItem onClick={() => handleShare('native')}>
                <Share2 className="h-4 w-4 mr-2 text-gray-500" />
                <span>Outros...</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Mobile Share Button - Only visible on small screens */}
      <Button 
        variant="outline" 
        size="icon" 
        className="sm:hidden"
        onClick={() => handleShare('native')}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
} 
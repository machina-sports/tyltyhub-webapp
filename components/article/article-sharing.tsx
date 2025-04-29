"use client"

import { useState } from "react"
import { Share2, MessageCircle, Instagram, Facebook } from "lucide-react"
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
  url: string
}

export function ArticleSharing({ articleId, title, url }: ArticleSharingProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Generate full URL if only articleId is provided
  const fullUrl = url || `${typeof window !== 'undefined' ? window.location.origin : ''}/discover/${articleId}`
  
  const shareText = `Confira este artigo: ${title}`
  
  const handleShare = (platform: string) => {
    let shareUrl = ''
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
        break
      case 'instagram':
        // Instagram doesn't have a direct share URL so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${fullUrl}`)
        toast({
          title: "Link copiado!",
          description: "Cole o link no Instagram para compartilhar."
        })
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
    <div className="flex items-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 
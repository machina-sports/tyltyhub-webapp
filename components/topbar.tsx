"use client"

import { Compass, MessageSquare } from "lucide-react"

import { usePathname, useRouter } from "next/navigation"

import { ShareIconButton } from "@/components/chat/share-icon-button"

import { SearchToggleButton } from "@/components/discover/search-toggle-button"

import { BrandLogo } from "@/components/brand"

import { useEffect, useState } from "react"

const routes = [
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/",
  },
  {
    label: "Descubrir",
    icon: Compass,
    href: "/discover",
  },
];

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  // Verifica se está em uma página de chat específico (não na home)
  const isChatPage = pathname && pathname.startsWith("/chat/") && pathname !== "/chat/new";
  // Verifica se está na página Discover
  const isDiscoverPage = pathname === "/discover";
  // Verifica se está em uma página de artigo
  const isArticlePage = pathname && pathname.startsWith("/discover/") && pathname !== "/discover";

  if (isMobile) {
    return (
      <div 
        className="sticky top-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-between px-6 py-2 h-20 w-full border-b topbar-mobile" 
        style={{
          borderColor: 'hsl(var(--brand-primary) / 0.2)'
        }}>
        <div
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer"
          role="button"
          aria-label="Ir al inicio"
        >
          <BrandLogo
            variant="full"
            width={80}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </div>
        
        {/* Botão Share apenas no mobile e apenas em páginas de chat específicas */}
        {isChatPage && (
          <ShareIconButton />
        )}
        
        {/* Botão Search apenas no mobile e apenas na página Discover */}
        {isDiscoverPage && (
          <SearchToggleButton />
        )}
      </div>
    );
  }

  return null;
}
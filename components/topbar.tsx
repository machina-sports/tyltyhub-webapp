"use client"

import { Compass, MessageSquare } from "lucide-react"

import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"

import { ShareIconButton } from "@/components/chat/share-icon-button"
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
    // Na página Discover ou Artigo, não renderizar o topbar (elas têm seus próprios)
    if (isDiscoverPage || isArticlePage) {
      return null;
    }

    return (
      <div className="flex items-center justify-between px-6 py-6 bg-bwin-neutral-0 w-full">
        <div
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer"
          role="button"
          aria-label="Ir al inicio"
        >
          <Image
            src="/bwin-logo.png"
            alt="bwin"
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
      </div>
    );
  }

  return null;
}
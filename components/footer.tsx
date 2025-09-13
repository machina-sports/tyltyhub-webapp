"use client"

import { Compass, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Conversar",
    icon: MessageSquare,
    href: "/",
  },
  {
    label: "Descubrir",
    icon: Compass,
    href: "/discover",
  },
];

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    };

    checkMobile();
    checkIOS();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  if (isMobile) {
    const footerStyle = isIOS ? {
      height: 'calc(80px + env(safe-area-inset-bottom, 20px))',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom, 20px))',
      // Força o footer a ficar visível no iOS Safari
      position: 'fixed' as const,
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: 9999,
    } : {
      height: '80px',
      paddingBottom: '8px'
    };

    return (
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 border-t flex items-center justify-around px-4 footer-mobile",
          isIOS ? "z-[9999]" : "z-50"
        )}
        style={{
          ...footerStyle,
          borderColor: 'hsl(var(--brand-primary) / 0.2)'
        }}
      >
        {routes.map((route) => (
          <Button
            key={route.href}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-2 h-auto pt-3 pb-2 px-6 rounded-xl transition-all duration-200 w-[100px] touch-manipulation text-white",
              // Melhor área de toque no iOS
              isIOS && "min-h-[44px]",
              pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? "bg-brand-primary/10"
                : ""
            )}
            style={{
              backgroundColor: pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? 'hsl(var(--brand-primary) / 0.15)'
                : 'transparent',
              touchAction: 'manipulation' // Evita o zoom no iOS ao tocar
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--hover))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? 'hsl(var(--brand-primary) / 0.15)'
                : 'transparent';
            }}
            onClick={() => handleNavigation(route.href)}
          >
            <route.icon className="h-6 w-6" />
            <span className="text-sm font-medium mt-[-2px]">{route.label}</span>
          </Button>
        ))}
      </div>
    );
  }

  return null;
}
"use client"

import { Compass, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils";
import { useBrand } from "@/contexts/brand-context";

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
  const { brand } = useBrand();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [lgpdConsentVisible, setLgpdConsentVisible] = useState(false);
  const [ageVerificationVisible, setAgeVerificationVisible] = useState(false);
  const [homeAnimationsComplete, setHomeAnimationsComplete] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    };

    const checkInitialStates = () => {
      // Check if age verification should be visible
      const hasAgeVerification = localStorage.getItem('age-verification');
      if (!hasAgeVerification) {
        console.log('Footer: Setting age verification visible on init');
        setAgeVerificationVisible(true);
      }

      // Check if LGPD consent should be visible
      const hasLgpdConsent = localStorage.getItem('lgpd-consent');
      if (!hasLgpdConsent && hasAgeVerification) {
        console.log('Footer: Setting LGPD consent visible on init');
        setLgpdConsentVisible(true);
      }
    };

    const handleLgpdConsentChange = (event: CustomEvent) => {
      console.log('Footer: LGPD Consent changed to:', event.detail.visible);
      setLgpdConsentVisible(event.detail.visible);
    };

    const handleAgeVerificationChange = (event: CustomEvent) => {
      console.log('Footer: Age Verification changed to:', event.detail.visible);
      setAgeVerificationVisible(event.detail.visible);
    };

    const handleHomeAnimationsComplete = () => {
      console.log('Footer: Home animations completed');
      setHomeAnimationsComplete(true);
    };

    checkMobile();
    checkIOS();
    checkInitialStates();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('lgpdConsentChange', handleLgpdConsentChange as EventListener);
    window.addEventListener('ageVerificationChange', handleAgeVerificationChange as EventListener);
    window.addEventListener('homeAnimationsComplete', handleHomeAnimationsComplete);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('lgpdConsentChange', handleLgpdConsentChange as EventListener);
      window.removeEventListener('ageVerificationChange', handleAgeVerificationChange as EventListener);
      window.removeEventListener('homeAnimationsComplete', handleHomeAnimationsComplete);
    };
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  if (isMobile) {
    // Only wait for animations on home page
    const isHomePage = pathname === '/';
    const isChatPage = pathname.startsWith('/chat');
    
    // Hide footer on chat pages when on mobile
    if (isChatPage) {
      return null;
    }
    
    if (lgpdConsentVisible || ageVerificationVisible || (isHomePage && !homeAnimationsComplete)) {
      return null;
    }
    const footerStyle = isIOS ? {
      height: 'calc(90px + env(safe-area-inset-bottom, 20px))',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom, 20px))',
      // Força o footer a ficar visível no iOS Safari
      position: 'fixed' as const,
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: 9999,
    } : {
      height: '90px',
      paddingBottom: '8px'
    };

    return (
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 border-t flex items-center justify-around px-4 pt-2 footer-mobile",
          isIOS ? "z-[9999]" : "z-50"
        )}
        style={{
          ...footerStyle,
          borderColor: 'hsl(var(--brand-primary))',
          backgroundColor: 'hsl(var(--background, var(--bwin-neutral-10)))'
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
                ? 'rgba(255, 255, 255, 0.15)'
                : ""
            )}
            style={{
              backgroundColor: pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? 'rgba(255, 255, 255, 0.15)'
                : 'transparent',
              touchAction: 'manipulation' // Evita o zoom no iOS ao tocar
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--hover))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? 'rgba(255, 255, 255, 0.15)'
                : 'transparent';
            }}
            onClick={() => handleNavigation(route.href)}
          >
            <route.icon className="h-6 w-6" />
            <span className="text-sm font-medium mt-[-2px]">{route.label}</span>
          </Button>
        ))}
        
        {/* Odds Disclaimer for Mobile */}
        {brand.responsibleGaming.footer?.oddsDisclaimer && (
          <div className="absolute bottom-1 left-0 right-0">
            <p className="text-xs text-muted-foreground text-center italic opacity-70">
              {brand.responsibleGaming.footer.oddsDisclaimer}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
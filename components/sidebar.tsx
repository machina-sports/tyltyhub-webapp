"use client";

import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Compass, MessageSquare } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export function Sidebar() {
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

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleRegisterClick = () => {
    trackEvent(
      'cta_click',
      'sidebar',
      'User clicked register button from sidebar'
    );
  };

  const handleLoginClick = () => {
    trackEvent(
      'login_click', 
      'sidebar',
      'User clicked login button from sidebar'
    );
  };

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-16 z-50 border-b bg-bwin-neutral-10 border-bwin-neutral-30">
        <div className="flex items-center justify-between h-full px-6">
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
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-4 pb-safe bg-bwin-neutral-10 border-bwin-neutral-30">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-xl transition-all duration-200",
                pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? "text-bwin-brand-primary bg-bwin-brand-primary/10"
                  : "text-bwin-neutral-80 hover:text-bwin-brand-primary hover:bg-bwin-neutral-20"
              )}
              onClick={() => handleNavigation(route.href)}
            >
              <route.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{route.label}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-80 border-r bg-bwin-neutral-10 border-bwin-neutral-30">
      <div className="px-8 py-6 flex-1 flex flex-col">
        {/* Logo container with proper spacing */}
        <div className="h-24 flex flex-col items-center justify-center mb-12">
          <div
            onClick={handleLogoClick}
            className="flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105"
            role="button"
            aria-label="Ir al inicio"
          >
            <Image
              src="/bwin-logo.png"
              alt="bwin"
              width={90}
              height={36}
              priority
              className="h-12 w-auto"
            />
          </div>
          <AnimatedShinyText className="text-sm text-bwin-neutral-70 pt-4 font-medium">
            La Inteligencia Artificial de bwin
          </AnimatedShinyText>
          <div className="text-xs text-bwin-neutral-60 pt-2 font-roboto">
            Versión Beta
          </div>
        </div>

        {/* Navigation with improved spacing */}
        <div className="space-y-3 border-t border-bwin-neutral-30 pt-8">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-base rounded-xl h-14 px-6 transition-all duration-200",
                pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? "bg-bwin-brand-primary/15 text-bwin-brand-primary hover:bg-bwin-brand-primary/20 font-semibold"
                  : "text-bwin-neutral-80 hover:bg-bwin-neutral-20 hover:text-bwin-brand-primary active:bg-bwin-neutral-30"
              )}
              onClick={() => handleNavigation(route.href)}
            >
              <route.icon className="h-5 w-5 mr-4" />
              {route.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* CTA buttons without shadows */}
      <div className="px-8 py-6 space-y-4">
        <a
          href="https://sports.bwin.es/es/sports/registro?utm_source=bwbot&utm_medium=botao&utm_campaign=5530097&utm_content=registrar&utm_term=5530097-botmundial-bwin-sprts-es-2025-06-17-es-botao--acq-web&wm=5530097"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleRegisterClick}
          className="block w-full py-4 px-6 font-semibold rounded-xl text-sm text-center transition-all duration-200 bg-bwin-brand-primary hover:bg-bwin-brand-secondary text-bwin-neutral-0 transform hover:scale-[1.02]"
        >
          Regístrate Ahora
        </a>
        <a
          href="https://sports.bwin.es/es/sports/login?utm_source=bwbot&utm_medium=botao&utm_campaign=5530097&utm_content=entrar&utm_term=5530097-botmundial-bwin-sprts-es-2025-06-17-es-botao--acq-web&wm=5530097"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLoginClick}
          className="block w-full py-4 px-6 font-semibold rounded-xl text-sm text-center border-2 transition-all duration-200 bg-transparent hover:bg-bwin-neutral-20 text-bwin-neutral-90 border-bwin-neutral-40 hover:border-bwin-brand-primary hover:text-bwin-brand-primary"
        >
          Iniciar Sesión
        </a>
      </div>

      {/* Enhanced Responsible Gaming Signals */}
      <div className="px-8 py-6 border-t border-bwin-neutral-30">
        <div className="flex flex-col items-center gap-4">
          {/* Main responsible gaming message */}
          <Image
            src="/Juega con responsabilidad.png"
            alt="Juega con responsabilidad"
            width={120}
            height={24}
            className="w-28 h-6"
          />
          
          {/* Fun message */}
          <Image
            src="/Sin diversión no hay juego.png"
            alt="Sin diversión no hay juego"
            width={100}
            height={32}
            className="w-24 h-8"
          />
          
          {/* Age and safety icons */}
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/+18.png"
              alt="+18"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src="/mano.png"
              alt="AutoProhibición"
              width={80}
              height={40}
              className="w-20 h-10"
            />
            <Image
              src="/Juego Seguro.png"
              alt="Juego Seguro"
              width={100}
              height={20}
              className="w-24 h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
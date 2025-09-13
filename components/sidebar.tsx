"use client";

import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { BrandLogo, BrandText } from "@/components/brand";
import { useBrand } from "@/contexts/brand-context";
import { trackEvent } from "@/lib/analytics";
import { applyBrandHoverColors } from "@/lib/brand-hover-utils";
import { cn } from "@/lib/utils";
import { Compass, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Routes will be defined dynamically based on brand
const getRoutes = (brand: any) => [
  {
    label: brand?.content?.navigation?.chat || "Conversar",
    icon: MessageSquare,
    href: "/",
  },
  {
    label: brand?.content?.navigation?.discover || "Descubrir",
    icon: Compass,
    href: "/discover",
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(true); // Start as true to prevent flash on mobile
  const { brand } = useBrand();
  
  const routes = getRoutes(brand);

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
    return null;
    return (
      <div className="fixed top-0 left-0 right-0 h-16 z-[55] border-b" style={{
        borderColor: 'hsl(var(--brand-primary) / 0.2)'
      }}>
        <div className="flex items-center justify-between h-full px-6">
          <div 
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer"
            role="button"
            aria-label="Ir al inicio"
          >
            <BrandLogo variant="full" width={80} height={32} className="h-8 w-auto" />
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-4 pb-safe" style={{
          borderColor: 'hsl(var(--brand-primary) / 0.2)'
        }}>
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-xl transition-all duration-200",
                pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? "text-brand-primary bg-brand-primary/10"
                  : "text-muted-foreground hover:text-brand-primary hover:bg-muted"
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
    <div className="hidden md:flex flex-col h-screen w-80 border-r sidebar-container" style={{
      borderColor: 'hsl(var(--border-primary))'
    }}>
      <div className="px-8 py-6 flex-1 flex flex-col">
        {/* Logo container with proper spacing */}
        <div className="h-24 flex flex-col items-center justify-center mb-12 pt-8">
          <div
            onClick={handleLogoClick}
            className="flex items-center justify-center cursor-pointer"
            role="button"
            aria-label="Ir al inicio"
          >
            <BrandLogo variant="full" width={90} height={36} className="h-12 w-auto" />
          </div>
          <AnimatedShinyText className="text-sm text-white pt-4 font-medium">
            {brand?.content?.subtitle || "La Inteligencia Artificial de bwin"}
          </AnimatedShinyText>
        </div>

        {/* Navigation with improved spacing */}
        <div className="space-y-3 border-t pt-8" style={{
          borderColor: 'hsl(var(--border-primary))'
        }}>
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-base rounded-xl h-14 px-6 transition-all duration-200 text-white",
                pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? "font-semibold"
                  : ""
              )}
              style={{
                backgroundColor: pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? 'hsl(var(--brand-primary) / 0.15)'
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                applyBrandHoverColors(e.currentTarget, brand);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                  ? 'hsl(var(--brand-primary) / 0.15)'
                  : 'transparent';
                e.currentTarget.style.color = 'white';
              }}
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
          href={brand?.content?.cta?.register || "https://sports.bwin.es/es/sports/registro"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleRegisterClick}
          className="block w-full py-4 px-6 font-semibold rounded-xl text-sm text-center sidebar-cta-button"
          style={{
            backgroundColor: 'hsl(var(--brand-primary))',
            color: 'white'
          }}
        >
          {brand?.content?.cta?.registerText || "Regístrate Ahora"}
        </a>
        <a
          href={brand?.content?.cta?.login || "https://sports.bwin.es/es/sports/login"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLoginClick}
          className="block w-full py-4 px-6 font-semibold rounded-xl text-sm text-center border-2 text-white"
          style={{
            color: 'white',
            borderColor: 'hsl(var(--border-primary) / 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--brand-primary) / 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {brand?.content?.cta?.loginText || "Iniciar Sesión"}
        </a>
      </div>

      {/* Responsible gaming logos removed */}
    </div>
  );
}
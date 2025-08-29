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

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-4 pb-safe bg-bwin-neutral-10 border-bwin-neutral-30">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-2 h-auto pt-2 pb-2 px-6 rounded-xl transition-all duration-200 w-[100px]",
              pathname === route.href || (route.href === "/chat/new" && pathname.startsWith("/chat"))
                ? "text-bwin-brand-primary bg-bwin-brand-primary/10"
                : "text-bwin-neutral-80 hover:text-bwin-brand-primary hover:bg-bwin-neutral-20"
            )}
            onClick={() => handleNavigation(route.href)}
          >
            <route.icon className="h-6 w-6" />
            <span className="text-sm font-medium mt-[-5px]">{route.label}</span>
          </Button>
        ))}
      </div>
    );
  }

  return null;
}
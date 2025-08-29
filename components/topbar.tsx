"use client"

import { Compass, MessageSquare } from "lucide-react"

import Image from "next/image"

import { useRouter } from "next/navigation"

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

  if (isMobile) {
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
      </div>
    );
  }

  return null;
}
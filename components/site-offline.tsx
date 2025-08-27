'use client';

import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import Image from 'next/image';
import { ResponsibleGamingResponsive } from './responsible-gaming-responsive';

export default function SiteOffline() {
  const handleBwinClick = () => {
    // Track the button click with Google Analytics
    trackEvent(
      'site_offline_bwin_click',
      'site_offline_page',
      'User clicked Bwin button from offline page'
    );
    
    // Open Bwin in a new tab
    window.open('https://sports.bwin.es/es/sports', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 fixed inset-0 z-50 bg-bwin-neutral-0">
      <div className="max-w-2xl w-full text-center">
        {/* Bwin Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/bwin-logo.png"
            alt="bwin"
            width={200}
            height={80}
            priority
            className="h-20 w-auto"
          />
        </div>

        {/* Card with messages */}
        <div className="bg-white rounded-2xl px-8 md:px-12 py-12 md:py-16 space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            ¡Volvemos pronto!
          </h1>

          {/* Secondary Heading */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-8">
            Es hora de mi pretemporada, amigo.
          </h2>

          {/* Description Text */}
          <div className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            <p>
              Pronto estaré de vuelta con novedades.
              <br />
              Mientras esperas, echa un vistazo a las promociones de bwin.{' '}
              <a
                href="https://sports.bwin.es/es/sports/promotions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bwin-brand-primary hover:text-bwin-brand-secondary underline font-semibold transition-colors duration-200"
              >
                Consulta aquí
              </a>
            </p>
          </div>

          {/* Bwin Button without shadow */}
          <Button
            onClick={handleBwinClick}
            className="font-bold text-lg px-16 py-6 rounded-xl bg-bwin-brand-primary hover:bg-bwin-brand-secondary text-bwin-neutral-0 transition-all duration-300 transform hover:scale-105"
          >
            Ir a bwin
          </Button>
        </div>
      </div>
      
      {/* Responsible Gaming Footer */}
      <ResponsibleGamingResponsive />
    </div>
  );
} 
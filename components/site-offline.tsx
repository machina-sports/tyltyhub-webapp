'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

export default function SiteOffline() {
  const handleSportingbetClick = () => {
    // Track the button click with Google Analytics
    trackEvent(
      'site_offline_sportingbet_click',
      'site_offline_page',
      'User clicked Sportingbet button from offline page'
    );
    
    // Open Sportingbet in a new tab
    window.open('https://www.sportingbet.bet.br/pt-br/sports', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 fixed inset-0 z-50" style={{ backgroundColor: '#013DC4' }}>
      <div className="max-w-2xl w-full text-center">
        {/* Sportingbot Logo - Outside the card */}
        <div className="flex justify-center mb-8">
          <Image
            src="/outline.png"
            alt="Sportingbot Logo"
            width={400}
            height={400}
            className="max-w-full h-auto"
            priority
          />
        </div>

        {/* Card with messages */}
        <div className="bg-white rounded-xl shadow-2xl px-6 md:px-6 py-8 md:py-12 space-y-6">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            SITE FORA DO AR
          </h1>

          {/* Secondary Heading */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-6">
            É hora da minha pré-temporada, parceiro.
          </h2>

          {/* Description Text */}
          <div className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            <p>
              Logo tô de volta com novidades.
              <br />
              Enquanto espera, se liga nas promoções da Sportingbet.{' '}
              <a
                href="https://www.sportingbet.bet.br/pt-br/promo/offers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Confira aqui
              </a>
            </p>
          </div>

          {/* Sportingbet Button */}
          <Button
            variant="sportingbet"
            size="xl"
            onClick={handleSportingbetClick}
            className="font-semibold text-lg px-12 py-4 rounded-lg shadow-lg hover:shadow-xl hover:brightness-90 transition-all duration-200"
          >
            Ir para Sportingbet
          </Button>
        </div>
      </div>
    </div>
  );
} 
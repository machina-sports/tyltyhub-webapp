'use client';

import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import Image from 'next/image';
import { ResponsibleGamingResponsive } from './responsible-gaming-responsive';
import { useBrandTexts } from '@/hooks/use-brand-texts';
import { useBrandConfig } from '@/contexts/brand-context';

export default function SiteOffline() {
  const { offline } = useBrandTexts();
  const brand = useBrandConfig();
  
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 fixed inset-0 z-50 bg-neutral-10">
      <div className="max-w-2xl w-full text-center">
        {/* Brand Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src={brand.branding.logo.full}
            alt={brand.displayName}
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
            {offline.title}
          </h1>

          {/* Secondary Heading */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-8">
            {offline.subtitle}
          </h2>

          {/* Description Text */}
          <div className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            <p>
              {offline.description.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < offline.description.split('\n').length - 1 && <br />}
                </span>
              ))}{' '}
              <a
                href={offline.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-secondary underline font-semibold transition-colors duration-200"
              >
                {offline.ctaLinkText}
              </a>
            </p>
          </div>

          {/* Brand Button without shadow */}
          <Button
            onClick={handleBwinClick}
            className="font-bold text-lg px-16 py-6 rounded-xl bg-brand-primary hover:bg-brand-secondary text-neutral-0 transition-all duration-300 transform hover:scale-105"
          >
            {offline.ctaText}
          </Button>
        </div>
      </div>
      
      {/* Responsible Gaming Footer */}
      <div className="pb-20 md:pb-0">
        <ResponsibleGamingResponsive />
      </div>
    </div>
  );
} 
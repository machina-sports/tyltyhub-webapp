"use client";

import { useEffect, useRef } from 'react';

interface WidgetEmbedProps {
  embedCode: string;
}

export default function WidgetEmbed({ embedCode }: WidgetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !embedCode) return;

    try {
      containerRef.current.innerHTML = '';
      
      let htmlContent = embedCode;
      
      if (embedCode.startsWith('[') && embedCode.endsWith(']')) {
        try {
          const parsedData = JSON.parse(embedCode);
          if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].embed) {
            htmlContent = parsedData[0].embed;
          }
        } catch (e) {
          console.error('Failed to parse widget embed JSON:', e);
        }
      }
      
      containerRef.current.innerHTML = htmlContent;

      // Track widget load event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'widget_load', {
          event_category: 'widget_embed',
          event_action: 'load_widget',
          event_label: 'Widget loaded successfully',
          widget_type: htmlContent.includes('odds') ? 'odds_widget' : 'generic_widget',
          widget_size: htmlContent.length
        });
      }

      // const scripts = containerRef.current.querySelectorAll('script');
      // scripts.forEach((oldScript) => {
      //   const newScript = document.createElement('script');
      //   Array.from(oldScript.attributes).forEach((attr) => {
      //     newScript.setAttribute(attr.name, attr.value);
      //   });
      //   newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      //   oldScript.parentNode?.replaceChild(newScript, oldScript);
      // });

      // Add click tracking to embedded content
      const addClickTracking = () => {
        const clickableElements = containerRef.current?.querySelectorAll('button, a, [onclick], [data-bet], .odds-button, .bet-button');
        clickableElements?.forEach((element, index) => {
          element.addEventListener('click', (event) => {
            if (typeof window !== 'undefined' && window.gtag) {
              const elementText = element.textContent?.trim() || '';
              const elementClass = element.className || '';
              const elementTag = element.tagName.toLowerCase();
              
              window.gtag('event', 'widget_interaction', {
                event_category: 'widget_embed',
                event_action: 'click_embedded_element',
                event_label: `${elementTag}: ${elementText}`,
                element_index: index,
                element_class: elementClass,
                element_text: elementText,
                widget_type: htmlContent.includes('odds') ? 'odds_widget' : 'generic_widget'
              });
            }
          });
        });
      };

      // Add tracking after a short delay to ensure DOM is ready
      setTimeout(addClickTracking, 100);

    } catch (error) {
      console.error('Error rendering widget embed:', error);
      
      // Track widget error event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'widget_error', {
          event_category: 'widget_embed',
          event_action: 'load_error',
          event_label: error instanceof Error ? error.message : 'Unknown error',
          error_type: error instanceof Error ? error.name : 'UnknownError'
        });
      }
    }
  }, [embedCode]);

  return <div ref={containerRef} className="widget-embed my-8" />;
} 
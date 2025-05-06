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

      const scripts = containerRef.current.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    } catch (error) {
      console.error('Error rendering widget embed:', error);
    }
  }, [embedCode]);

  return <div ref={containerRef} className="widget-embed my-8" />;
} 
"use client"

import { generateBrandCSS } from '@/lib/dynamic-css'

export function DynamicCSS() {
  // Inject CSS immediately on mount, before any rendering
  if (typeof window !== 'undefined') {
    let styleElement = document.getElementById('brand-dynamic-css')
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = 'brand-dynamic-css'
      document.head.appendChild(styleElement)
    }
    
    // Set the CSS content immediately - this will override the basic colors with brand-specific ones
    styleElement.textContent = generateBrandCSS()
  }

  return null
}

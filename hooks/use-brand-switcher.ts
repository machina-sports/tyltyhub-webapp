'use client';

import { useState, useEffect } from 'react';
import { getBrandConfig, getAvailableBrands } from '@/config/brands';

export function useBrandSwitcher() {
  const [currentBrandId, setCurrentBrandId] = useState('bwin');
  const [isLoading, setIsLoading] = useState(true);
  const availableBrands = getAvailableBrands();

  useEffect(() => {
    // Load brand from localStorage or environment
    const storedBrand = localStorage.getItem('selectedBrand');
    const envBrand = process.env.NEXT_PUBLIC_BRAND;
    const brandId = storedBrand || envBrand || 'bwin';
    
    setCurrentBrandId(brandId);
    setIsLoading(false);
  }, []);

  const switchBrand = (brandId: string) => {
    if (brandId === currentBrandId) return;
    
    // Store in localStorage
    localStorage.setItem('selectedBrand', brandId);
    setCurrentBrandId(brandId);
    
    // Reload page to apply new brand
    window.location.reload();
  };

  const currentBrand = getBrandConfig(currentBrandId);

  return {
    currentBrand,
    currentBrandId,
    availableBrands,
    switchBrand,
    isLoading,
  };
}

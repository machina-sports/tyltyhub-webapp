'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrandConfig, getBrandConfig } from '@/config/brands';

interface BrandContextType {
  brand: BrandConfig;
  setBrand: (brandId: string) => void;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  // Dynamic brand configuration based on environment variable
  const brand = getBrandConfig();
  const isLoading = false;

  const setBrand = (brandId: string) => {
    // No-op for static approach
    console.warn('Brand switching is disabled in static mode');
  };

  return (
    <BrandContext.Provider value={{ brand, setBrand, isLoading }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}

// Hook for accessing specific brand properties
export function useBrandConfig() {
  const { brand } = useBrand();
  return brand;
}

// Hook for brand colors
export function useBrandColors() {
  const { brand } = useBrand();
  return brand.branding.colors;
}

// Hook for brand content
export function useBrandContent() {
  const { brand } = useBrand();
  return brand.content;
}

// Hook for brand features
export function useBrandFeatures() {
  const { brand } = useBrand();
  return brand.features;
}

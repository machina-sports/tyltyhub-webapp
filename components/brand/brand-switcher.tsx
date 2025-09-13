'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrandSwitcher } from '@/hooks/use-brand-switcher';

export function BrandSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentBrand, currentBrandId, availableBrands, switchBrand, isLoading } = useBrandSwitcher();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Loading brand switcher...</div>
            <div className="text-xs text-muted-foreground mt-2">
              Current ID: {currentBrandId}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Brand Switcher (Dev Only)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2">
            Current: <strong>{currentBrand.displayName}</strong>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableBrands.map((brandId) => (
              <Button
                key={brandId}
                variant={currentBrand.id === brandId ? "default" : "outline"}
                size="sm"
                onClick={() => switchBrand(brandId)}
                className="text-xs"
                disabled={currentBrand.id === brandId}
              >
                {brandId}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <strong>Features:</strong> Avatar: {currentBrand.features.enableAvatar ? '✅' : '❌'}, 
            Bets: {currentBrand.features.enableBets ? '✅' : '❌'}, 
            Chat: {currentBrand.features.enableChat ? '✅' : '❌'}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <strong>Note:</strong> Click a brand to switch. Page will reload.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
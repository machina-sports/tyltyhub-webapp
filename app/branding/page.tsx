import { Dot, SportingbetDot, SportingbetDarkDot } from "@/components/ui/dot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { DotProps } from "@/components/ui/dot"; // Import the interface

export default function BrandingPage() {
  return (
    <div className="container py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          Sportingbet Brand Elements <SportingbetDot size={32} className="ml-2" />
        </h1>
        <p className="text-muted-foreground mb-8">
          Demonstration of the Sportingbet DOT and other brand elements
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">DOT Component</h2>
        <Card>
          <CardHeader>
            <CardTitle>Basic DOT Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <Dot size={16} />
                <span className="text-xs text-muted-foreground">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={24} />
                <span className="text-xs text-muted-foreground">24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={32} />
                <span className="text-xs text-muted-foreground">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={48} />
                <span className="text-xs text-muted-foreground">48px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={64} />
                <span className="text-xs text-muted-foreground">64px</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <SportingbetDot size={40} />
                <span className="text-xs text-muted-foreground">Bright Blue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <SportingbetDarkDot size={40} />
                <span className="text-xs text-muted-foreground">Dark Blue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#45CAFF" />
                <span className="text-xs text-muted-foreground">Light Blue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#D3ECFF" />
                <span className="text-xs text-muted-foreground">Extra Light Blue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#F13131" />
                <span className="text-xs text-muted-foreground">Bright Red</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">UI Component Integration</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Button with DOT <SportingbetDot size={20} className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default" className="flex items-center gap-2">
                Primary <SportingbetDot size={16} />
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                Secondary <SportingbetDot size={16} />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Outline <SportingbetDot size={16} />
              </Button>
              <Button variant="sportingbet" className="flex items-center gap-2">
                Sportingbet <SportingbetDot size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Badge variant="default" className="flex items-center gap-1.5">
                Default <SportingbetDot size={10} />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5">
                Secondary <SportingbetDot size={10} />
              </Badge>
              <Badge variant="sportingbet" className="flex items-center gap-1.5">
                Sportingbet <SportingbetDot size={10} />
              </Badge>
              <Badge variant="sportingbetOutline" className="flex items-center gap-1.5">
                Outline <SportingbetDot size={10} />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Animation Examples</h2>
        <Card>
          <CardHeader>
            <CardTitle>Animated DOT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-8">
              <Dot 
                size={48} 
                className="animate-spin-slow" 
                style={{ animationDuration: '8s', transformOrigin: 'center' }} 
              />
              <Dot 
                size={48} 
                className="animate-pulse" 
              />
              <Dot 
                size={48} 
                className="hover:scale-125 transition-transform duration-300" 
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-t pt-6">
        <div className="text-sm text-muted-foreground">
          <p>The DOT element is a key part of the Sportingbet brand identity. Use it consistently across the platform.</p>
          <p className="mt-2">Implementation based on Sportingbet brand guidelines v2.2 (December 2024).</p>
        </div>
      </section>
    </div>
  );
} 
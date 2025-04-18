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
          Elementos da Marca Sportingbet <SportingbetDot size={32} className="ml-2" />
        </h1>
        <p className="text-muted-foreground mb-8">
          Demonstração do DOT Sportingbet e outros elementos da marca
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Componente DOT</h2>
        <Card>
          <CardHeader>
            <CardTitle>Uso Básico do DOT</CardTitle>
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
            <CardTitle>Variantes de Cor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <SportingbetDot size={40} />
                <span className="text-xs text-muted-foreground">Azul Brilhante</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <SportingbetDarkDot size={40} />
                <span className="text-xs text-muted-foreground">Azul Escuro</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#45CAFF" />
                <span className="text-xs text-muted-foreground">Azul Claro</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#D3ECFF" />
                <span className="text-xs text-muted-foreground">Azul Extra Claro</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dot size={40} color="#F13131" />
                <span className="text-xs text-muted-foreground">Vermelho Brilhante</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Integração com Componentes de UI</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Botão com DOT <SportingbetDot size={20} className="ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default" className="flex items-center gap-2">
                Primário <SportingbetDot size={16} />
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                Secundário <SportingbetDot size={16} />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Contorno <SportingbetDot size={16} />
              </Button>
              <Button variant="sportingbet" className="flex items-center gap-2">
                Sportingbet <SportingbetDot size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Badge variant="default" className="flex items-center gap-1.5">
                Padrão <SportingbetDot size={10} />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5">
                Secundário <SportingbetDot size={10} />
              </Badge>
              <Badge variant="sportingbet" className="flex items-center gap-1.5">
                Sportingbet <SportingbetDot size={10} />
              </Badge>
              <Badge variant="sportingbetOutline" className="flex items-center gap-1.5">
                Contorno <SportingbetDot size={10} />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Exemplos de Animação</h2>
        <Card>
          <CardHeader>
            <CardTitle>DOT Animado</CardTitle>
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
          <p>O elemento DOT é uma parte chave da identidade da marca Sportingbet. Use-o de forma consistente em toda a plataforma.</p>
          <p className="mt-2">Implementação baseada nas diretrizes de marca Sportingbet v2.2 (Dezembro 2024).</p>
        </div>
      </section>
    </div>
  );
} 
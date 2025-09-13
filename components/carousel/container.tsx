"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Add a memoized wrapper component
const WidgetEmbed = React.memo(({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />  
))
WidgetEmbed.displayName = 'WidgetEmbed'

// Widget Carousel Component
export const WidgetCarousel = React.memo(({ 
  widgets, 
  isDarkMode 
}: { 
  widgets: Array<{ name?: string; embed?: string; component?: React.ReactNode }>;
  isDarkMode: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextWidget = () => {
    setCurrentIndex((prev) => (prev + 1) % widgets.length);
  };

  const prevWidget = () => {
    setCurrentIndex((prev) => (prev - 1 + widgets.length) % widgets.length);
  };

  const goToWidget = (index: number) => {
    setCurrentIndex(index);
  };

  if (widgets.length === 0) return null;

  const renderWidget = (widget: { name?: string; embed?: string; component?: React.ReactNode }) => {
    if (widget.component) {
      return widget.component;
    }
    if (widget.embed) {
      return <WidgetEmbed content={widget.embed} />;
    }
    return null;
  };

  if (widgets.length === 1) {
    return (
      <div className="rounded-lg border p-2 border-border bg-card">
        {renderWidget(widgets[0])}
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-2 border-border bg-card">
      {/* Widget Display */}
      <div className="overflow-hidden rounded-md">
        {renderWidget(widgets[currentIndex])}
      </div>

      {/* Footer with Navigation and Indicators */}
      <div className="flex items-center justify-between mt-2">
        {/* Left Arrow */}
        <button
          onClick={prevWidget}
          className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
          aria-label="Widget anterior"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-1">
          {widgets.map((_, index) => (
            <button
              key={index}
              onClick={() => goToWidget(index)}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                index === currentIndex
                  ? "bg-brand-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Ir al widget ${index + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextWidget}
          className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
          aria-label="Siguiente widget"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
});
WidgetCarousel.displayName = 'WidgetCarousel';

"use client";

import { memo, useEffect, useRef } from "react";
import QuestionButton from "./question-button";

const ScrollingRow = ({ 
  questions, 
  onSampleQuery 
}: { 
  questions: string[]; 
  onSampleQuery: (text: string) => void 
}) => {
  const scrollingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollingContent = scrollingRef.current;
    if (!scrollingContent) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= scrollingContent.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollingContent.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="scrolling-row group relative overflow-hidden rounded-lg">
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10" />
      <div 
        ref={scrollingRef}
        className="scrolling-content flex will-change-transform"
      >
        {[...questions, ...questions].map((text, index) => (
          <QuestionButton
            key={`${text}-${index}`}
            text={text}
            onClick={() => onSampleQuery(text)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ScrollingRow);
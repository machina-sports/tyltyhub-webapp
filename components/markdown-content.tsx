"use client";

import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownChat({ content, className }: MarkdownContentProps) {
  return (
    <article className={cn("max-w-none break-words", className)} style={{ wordBreak: 'break-word' }}>
      <Markdown
        options={{
          overrides: {
            ul: { props: { className: 'list-disc ml-8 mt-4 mb-4 break-words', style: { wordBreak: 'break-word' } } },
            ol: { props: { className: 'list-decimal ml-8 mt-4 mb-8 break-words', style: { wordBreak: 'break-word' } } },
            li: { props: { className: 'mb-0 break-words', style: { wordBreak: 'break-word' } } },
            p:  { props: { className: 'text-xs ml-4 mt-4 mb-0 break-words', style: { wordBreak: 'break-word' } } }
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <article className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
      <Markdown
        options={{
          overrides: {
            ul: { props: { className: 'list-disc ml-8 mt-4 mb-8' } },
            ol: { props: { className: 'list-decimal ml-8 mt-4 mb-8' } },
            li: { props: { className: 'mb-8 ' } },
            p:  { props: { className: 'mt-4 mb-8' } },
            span:  { props: { className: 'mt-4 mb-8' } },
            h2: { props: { className: 'text-lg font-bold mt-8 mb-8' } },
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}
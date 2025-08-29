"use client";

import Markdown from "markdown-to-jsx";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnchorHTMLAttributes } from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const href = props.href || "";
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
};

export function MarkdownChat({ content, className }: MarkdownContentProps) {
  return (
    <article className={cn("prose prose-neutral dark:prose-invert max-w-none text-sm break-words", className)}>
      <Markdown
        options={{
          overrides: {
            a: {
              component: MarkdownLink,
              props: { className: "text-[#FFCB00] dark:text-[#FDBA12] underline" },
            },
            ul: { 
              props: { 
                className: "list-none space-y-4 mt-4 mb-3" 
              } 
            },
            ol: { 
              props: { 
                className: "list-none space-y-4 mt-4 mb-3" 
              } 
            },
            li: { 
              props: { 
                className: "relative pl-6 leading-relaxed" 
              } 
            },
            p: { 
              props: { 
                className: "my-3 leading-relaxed" 
              } 
            },
            h1: { 
              props: { 
                className: "text-base font-bold mb-4 text-bwin-neutral-100 leading-tight" 
              } 
            },
            h2: { 
              props: { 
                className: "text-sm font-semibold mb-3 text-bwin-neutral-100 leading-tight" 
              } 
            },
            h3: { 
              props: { 
                className: "text-sm font-semibold mb-3 text-bwin-neutral-100 leading-tight" 
              } 
            },
            strong: { 
              props: { 
                className: "font-bold text-bwin-yellow-subtle" 
              } 
            },
            em: { 
              props: { 
                className: "italic text-bwin-neutral-70" 
              } 
            },
            code: { 
              props: { 
                className: 'bg-bwin-neutral-25 px-1.5 py-0.5 rounded text-xs font-mono text-bwin-yellow-muted border border-bwin-neutral-30' 
              } 
            },
            blockquote: { 
              props: { 
                className: 'border-l-4 border-bwin-yellow-soft pl-4 py-3 my-4 bg-bwin-neutral-15 rounded-r-lg italic text-bwin-neutral-70' 
              } 
            },
            table: { 
              props: { 
                className: 'my-4 text-sm w-full border-collapse border border-bwin-neutral-30 rounded-lg overflow-hidden' 
              } 
            },
            thead: { 
              props: { 
                className: 'bg-bwin-neutral-25 text-bwin-neutral-100' 
              } 
            },
            tr: { 
              props: { 
                className: 'border-b border-bwin-neutral-30' 
              } 
            },
            th: { 
              props: { 
                className: 'p-3 text-left font-semibold' 
              } 
            },
            td: { 
              props: { 
                className: 'p-3 text-left' 
              } 
            },
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
            a: {
              component: MarkdownLink,
            },
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
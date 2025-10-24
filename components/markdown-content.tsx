"use client";

import Markdown from "markdown-to-jsx";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnchorHTMLAttributes } from "react";
import { convertUrlsToMarkdown } from "@/lib/url-utils";
import { replaceBettingLinks } from "@/lib/betting-links";

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
  const processedContent = content;
  return (
    <article className={cn("prose prose-neutral dark:prose-invert max-w-none text-sm break-words", className)}>
      <Markdown
        options={{
          overrides: {
            a: {
              component: MarkdownLink,
              props: { className: "text-brand-primary underline hover:underline" },
            },
            ul: { 
              props: { 
                className: "list-none space-y-4 mt-4 mb-4" 
              } 
            },
            ol: { 
              props: { 
                className: "list-none space-y-4 mt-4 mb-4" 
              } 
            },
            li: { 
              props: { 
                className: "relative pl-6 leading-relaxed" 
              } 
            },
            p: { 
              props: { 
                className: "my-2 leading-relaxed" 
              } 
            },
            h1: { 
              props: { 
                className: "text-base font-bold mt-6 mb-4 text-foreground leading-tight" 
              } 
            },
            h2: { 
              props: { 
                className: "text-sm font-semibold mt-5 mb-3 text-foreground leading-tight" 
              } 
            },
            h3: { 
              props: { 
                className: "text-sm font-semibold mt-4 mb-3 text-foreground leading-tight" 
              } 
            },
            strong: { 
              props: { 
                className: "font-bold text-foreground" 
              } 
            },
            em: { 
              props: { 
                className: "italic text-muted-foreground" 
              } 
            },
            code: { 
              props: { 
                className: 'bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono text-foreground border border-border' 
              } 
            },
            blockquote: { 
              props: { 
                className: 'border-l-4 border-brand-primary pl-4 py-3 my-4 bg-muted/30 rounded-r-lg italic text-muted-foreground' 
              } 
            },
            table: { 
              props: { 
                className: 'my-4 text-sm w-full border-collapse border border-border rounded-lg overflow-hidden' 
              } 
            },
            thead: { 
              props: { 
                className: 'bg-muted text-foreground' 
              } 
            },
            tr: { 
              props: { 
                className: 'border-b border-border' 
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
        {processedContent}
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
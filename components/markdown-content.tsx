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
              props: { className: "text-blue-600 dark:text-blue-400 underline" },
            },
            ul: { props: { className: "list-disc mt-2" } },
            ol: { props: { className: "list-decimal mt-2" } },
            li: { props: { className: "my-4 ml-4" } },
            p:  { props: { className: "my-2" } },
            h2: { props: { className: "font-bold text-sm" } },
            h3: { props: { className: "font-bold text-sm" } },
            strong: { props: { className: "font-bold" } },
            code: { props: { className: 'not-prose font-semibold' } },
            blockquote: { props: { className: 'not-prose my-2 py-2 px-3 pl-4 bg-muted/50 rounded-lg text-sm text-foreground/90 dark:text-[#D3ECFF] dark:bg-[#061F3F]/50 border-l-4 border-primary dark:border-[#45CAFF]' } },
            table: { props: { className: 'my-4 text-sm w-full border-collapse' } },
            thead: { props: { className: 'bg-muted/50 text-foreground/90 dark:text-[#D3ECFF] dark:bg-[#061F3F]/50' } },
            tr: { props: { className: 'border-b' } },
            th: { props: { className: 'p-3 text-left font-semibold' } },
            td: { props: { className: 'p-3 text-left' } },
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
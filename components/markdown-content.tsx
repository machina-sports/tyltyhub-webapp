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
    <article className={cn("max-w-none break-words", className)}>
      <Markdown
        options={{
          overrides: {
            a: {
              component: MarkdownLink,
              props: { className: "text-blue-600 dark:text-blue-400 underline" },
            },
            ul: { props: { className: 'list-disc ml-8 mt-4 mb-4' } },
            ol: { props: { className: 'list-decimal ml-8 mt-4 mb-8' } },
            li: { props: { className: 'mb-0' } },
            p:  { props: { className: 'text-xs ml-4 mt-4 mb-0' } },
            h3: { props: { className: 'text-base font-bold mt-6 mb-2 ml-4' } },
            strong: { props: { className: 'font-bold' } },
            code: { props: { className: 'font-mono rounded-md bg-zinc-200/50 px-1.5 py-0.5 text-sm text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200' } },
            blockquote: { props: { className: 'pl-4 italic border-l-4 my-4 ml-4' } },
            table: { props: { className: 'my-4 text-sm w-full border-collapse border' } },
            thead: { props: { className: 'bg-muted/50' } },
            tr: { props: { className: 'border-b' } },
            th: { props: { className: 'border p-2 text-left font-semibold' } },
            td: { props: { className: 'border p-2 text-left' } },
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
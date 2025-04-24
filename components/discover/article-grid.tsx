"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'

interface Article {
  id: string
  title: string
  description: string
  image: string
  author: string
  readTime: string
  category: string
  date: string
}

interface ArticleGridProps {
  articles: Article[]
}

// Helper function to unescape common sequences in the JSON string
const unescapeMarkdown = (text: string): string => {
  return text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

// Helper function to extract a snippet from the full description
const getDescriptionSnippet = (description: string, maxLength: number = 150) => {
  // Unescape the description first
  const unescapedDescription = unescapeMarkdown(description);
  
  // Extract the first paragraph or use the whole text if no paragraphs
  const firstParagraph = unescapedDescription.split('\n\n')[0];
  
  // If the paragraph is already short enough, return it
  if (firstParagraph.length <= maxLength) return firstParagraph;
  
  // Otherwise truncate it
  return firstParagraph.slice(0, maxLength) + '...';
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <Link href={`/discover/${article.id}`}>
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
                <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{article.title}</h2>
                <div className="text-muted-foreground text-sm mb-4 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {getDescriptionSnippet(article.description)}
                  </ReactMarkdown>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-secondary" />
                    <span className="text-sm text-muted-foreground">{article.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(article.date), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
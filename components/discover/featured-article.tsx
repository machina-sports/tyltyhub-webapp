"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'

interface FeaturedArticleProps {
  article: {
    id: string
    title: string
    description: string
    image: string
    author: string
    readTime: string
    category: string
    date: string
  }
}

// Helper function to extract a snippet from the full description
const getDescriptionSnippet = (description: string, maxLength: number = 200) => {
  // Extract the first paragraph or use the whole text if no paragraphs
  const firstParagraph = description.split('\n\n')[0];
  
  // If the paragraph is already short enough, return it
  if (firstParagraph.length <= maxLength) return firstParagraph;
  
  // Otherwise truncate it
  return firstParagraph.slice(0, maxLength) + '...';
};

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/discover/${article.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(article.date), { addSuffix: true, locale: ptBR })}
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">{article.title}</h1>
            <p className="text-muted-foreground mb-4">{getDescriptionSnippet(article.description)}</p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary" />
              <span className="text-sm text-muted-foreground">{article.author}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
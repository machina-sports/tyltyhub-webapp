"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import { config } from "@/libs/config"

interface Article {
  _id?: string
  id?: string
  title: string
  description: string
  image?: string
  image_url?: string
  author: string
  readTime?: string
  category: string
  date: string | Date
  createdAt?: string | Date
}

interface ArticleGridProps {
  articles: Article[]
  layout?: 'fullWidth' | 'threeCards'
}

// Helper function to unescape common sequences in the JSON string
const unescapeMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

// Helper function to extract a snippet from the full description
const getDescriptionSnippet = (description: string | undefined | null, maxLength: number = 150) => {
  if (!description) return '';
  
  // Unescape the description first
  const unescapedDescription = unescapeMarkdown(description);
  
  // Extract the first paragraph or use the whole text if no paragraphs
  const firstParagraph = unescapedDescription.split('\n\n')[0];
  
  // If the paragraph is already short enough, return it
  if (firstParagraph.length <= maxLength) return firstParagraph;
  
  // Otherwise truncate it
  return firstParagraph.slice(0, maxLength) + '...';
};

// Helper to get a valid image URL
const getImageUrl = (article: Article): string => {
  if (!article) return '';
  
  if (article.image) {
    return article.image;
  }
  
  if (article.image_url) {
    return `${config.IMAGE_CONTAINER_ADDRESS}/${article.image_url}`;
  }
  
  // Create placeholder if no image
  const title = article.title || 'Article';
  return `https://placehold.co/800x450/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

// Render a single article card
const ArticleCard = ({ article }: { article: Article }) => {
  
  const articleId = article._id || article.id;
  const articleDate = article.createdAt || article.date;
  const imageUrl = article.image || getImageUrl(article);
  
  if (!articleId) return null;
  
  return (
    <Card key={articleId} className="overflow-hidden h-full border">
      <Link 
        href={`/discover/${articleId}`} 
        className="h-full block"
        prefetch={false}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-[16/9] w-full">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={article.title || 'Article Image'}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-3 flex flex-col flex-grow">
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">{article.category || 'Notícias'}</Badge>
            </div>
            <h3 className="text-sm md:text-base font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">{article.title || 'Sem título'}</h3>
            <div className="text-muted-foreground text-xs mb-auto">
              <p className="line-clamp-2">
                {getDescriptionSnippet(article.description, 80) || 'Sem descrição'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-[10px] font-medium">
                  {article.author ? article.author.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-muted-foreground truncate max-w-[85px]">{article.author || 'Autor'}</span>
              </div>
              <div className="flex items-center text-muted-foreground whitespace-nowrap">
                <CalendarDays className="h-3 w-3 mr-1" />
                {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale: ptBR }) : 'Recente'}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export function ArticleGrid({ articles, layout = 'threeCards' }: ArticleGridProps) {
  
  if (!articles || articles.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">Nenhum artigo encontrado</div>;
  }

  if (layout === 'fullWidth' && articles.length > 0) {
    const article = articles[0];
    
    const articleId = article._id || article.id;
    const articleDate = article.createdAt || article.date;
    const imageUrl = article.image || getImageUrl(article);
    
    if (!articleId) return null;
    
    return (
      <Card className="overflow-hidden border">
        <Link 
          href={`/discover/${articleId}`}
          prefetch={false}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:grid md:grid-cols-12 gap-0">
              <div className="md:col-span-7">
                <div className="relative aspect-[16/9] md:aspect-auto md:h-full w-full">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={article.title || 'Article Image'}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
              </div>
              <div className="md:col-span-5 p-4 md:p-5 flex flex-col">
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary">{article.category || 'Notícias'}</Badge>
                  </div>
                  
                  <h1 className="text-lg md:text-xl font-bold line-clamp-3 hover:text-primary transition-colors">{article.title || 'Sem título'}</h1>
                  
                  <div className="text-muted-foreground prose prose-sm prose-neutral dark:prose-invert max-w-none md:line-clamp-4">
                    <ReactMarkdown>
                      {getDescriptionSnippet(article.description, 180) || 'Sem descrição'}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-xs font-medium">
                      {article.author ? article.author.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">{article.author || 'Autor'}</span>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale: ptBR }) : 'Recente'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }
  const gridCols = articles.length === 1 ? 'md:grid-cols-1' : 
                   articles.length === 2 ? 'md:grid-cols-2' : 
                   'md:grid-cols-3';
                   
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {articles.map((article) => (
        <ArticleCard key={article._id || article.id || Math.random().toString()} article={article} />
      ))}
    </div>
  )
}
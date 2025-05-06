"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Image from "next/image"
import Link from "next/link"
import { useGlobalState } from "@/store/useState"
import { Article } from "@/store/slices/articlesSlice"

interface RelatedArticlesProps {
  currentArticleId: string
}

// Helper to get a valid image URL
const getImageUrl = (article: any): string => {
  if (!article) return '';
  
  if (article.image) {
    return article.image;
  }
  
  if (article.image_url) {
    return `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/${article.image_url}`;
  }
  
  return '';
};

export function RelatedArticles({ currentArticleId }: RelatedArticlesProps) {
  const { articles } = useGlobalState();
  
  // Filter out the current article and limit to 4 related articles
  const relatedArticles = articles.articles
    ?.filter((article: Article) => {
      const id = article._id || article.id;
      return id !== currentArticleId;
    })
    .slice(0, 4) || [];

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <h3 className="text-lg font-semibold">Artigos Relacionados</h3>
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 snap-x scroll-smooth">
        {relatedArticles.map((article: Article) => {
          const articleId = article._id || article.id;
          const articleDate = article.createdAt || article.date;
          const imageUrl = getImageUrl(article);
          
          if (!articleId) return null;
          
          return (
            <Card key={articleId} className="overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[280px] max-w-[280px]">
              <Link 
                href={`/discover/${articleId}`}
                prefetch={false}
              >
                <div className="relative aspect-video w-full snap-start">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={article.title || 'Article Image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 280px, 33vw"
                    />
                  )}
                </div>
                <div className="p-4 w-full">
                  <h4 className="font-semibold line-clamp-2 mb-2 text-base">{article.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-muted" />
                    {articleDate ? 
                      formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale: ptBR }) : 
                      'Recente'
                    }
                  </p>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  )
}
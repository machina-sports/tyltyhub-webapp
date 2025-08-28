"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Image from "next/image"
import Link from "next/link"
import { useGlobalState } from "@/store/useState"
import { Article } from "@/providers/article/reducer"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

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
  const articles = useGlobalState((state: any) => state.article);
  const { isDarkMode } = useTheme();

  // Filter out the current article and limit to 4 related articles
  const relatedArticles = articles.relatedArticles
    ?.filter((article: Article) => {
      const id = article._id || article.id;
      return id !== currentArticleId;
    })
    .slice(0, 4) || [];

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Artigos Relacionados</h3>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {relatedArticles.map((article: Article) => {
          const articleId = article._id || article.id;
          const imageUrl = article.image || 'https://placehold.co/600x400?text=Artigo';
          const articleDate = article.date || article.createdAt;

          return (
            <Card key={articleId} className={cn(
              "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[280px] max-w-[280px]",
              isDarkMode
                ? "bg-[#061F3F] border-[#FFCB00]/30 hover:border-[#FFCB00]/50"
                : "hover:border-primary/30"
            )}>
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
                  <h4 className={cn(
                    "font-semibold line-clamp-2 mb-2 text-base transition-colors",
                    isDarkMode
                      ? "text-[#D3ECFF] hover:text-[#FFCB00]"
                      : "hover:text-primary"
                  )}>
                    {article.title}
                  </h4>
                  <p className={cn(
                    "text-sm flex items-center gap-2",
                    isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
                  )}>
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      isDarkMode ? "bg-[#FFCB00]" : "bg-muted"
                    )} />
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
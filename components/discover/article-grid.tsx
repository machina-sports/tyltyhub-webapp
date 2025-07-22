"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import { Article } from "@/providers/article/reducer"
import { cn } from "@/lib/utils"

interface ArticleGridProps {
  articles: Article[]
  layout?: 'fullWidth' | 'threeCards'
}

const getImageUrl = (article: Article): string => {
  if (!article?.value) return '';
  
  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;
  const mainImageName = article.value?.["main_image_name"];
  const articleId = article._id || article.id;

  if (imageAddress && mainImageName && articleId) {
    return `${imageAddress}/article-image-id-${articleId}-${mainImageName}.png`;
  } else if (imageAddress && article.value?.image_path) {
    return `${imageAddress}/${article.value.image_path}`;
  }
  
  return '';
};

const getTitle = (article: Article): string => {
  return article?.value?.title || 'Sin título';
};

const getDescription = (article: Article): string => {
  return article?.value?.subtitle || article?.value?.section_1_content || 'Sin descripción';
};

const getAuthor = (article: Article): string => {
  return 'bwinBOT';
};

const getArticleUrl = (article: Article): string => {
  const articleId = article._id || article.id;
  const slug = article?.value?.slug;
  return `/discover/${slug || articleId}`;
};

const getEventType = (article: Article): string => {
  if (!article || !article.metadata) return 'Noticias';

  // For soccer games, return "Fútbol"
  if (article.metadata.event_type === 'soccer-game') {
    return 'Fútbol';
  }

  // For competition names, make them more readable
  if (article.metadata.competition) {
    switch (article.metadata.competition) {
      case 'sr:competition:17':
        return 'Premier League';
      case 'sr:competition:384':
        return 'Libertadores';
      case 'sr:competition:390':
        return 'Brasileño Serie B';
      default:
        return article.metadata.competition;
    }
  }

  return 'Noticias';
};

const getDescriptionSnippet = (description: string, maxLength: number): string => {
  if (!description || typeof description !== 'string') return '';
  if (description.length <= maxLength) return description;
  
  // Find the last complete word within the limit
  const truncated = description.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

const ArticleCard = ({ article }: { article: Article }) => {
  if (!article) return null;

  const articleId = article._id || article.id;
  if (!articleId) return null;

  const articleUrl = getArticleUrl(article);
  const articleDate = article.created || article.date;
  const imageUrl = getImageUrl(article);
  const eventType = getEventType(article);
  const description = getDescription(article);
  const author = getAuthor(article);
  const title = getTitle(article);

  const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleId}`
  const mainImageUrl = `${mainImagePrefix}-${article.value?.["main_image_name"]}.png`

  return (
    <Card className="overflow-hidden border bg-bwin-neutral-20 border-bwin-neutral-30 hover:border-bwin-brand-primary/50 transition-colors">
      <Link
        href={articleUrl}
        className="h-full block"
        prefetch={false}
      >
        <CardContent className="p-0 flex flex-col md:flex-col h-full">
          {/* Mobile: Horizontal layout with image on left */}
          <div className="flex md:hidden">
            <div className="relative w-32 h-24 flex-shrink-0">
              {imageUrl && (
                <Image
                  src={mainImageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-l-lg"
                  priority={false}
                  sizes="150px"
                />
              )}
            </div>
            <div className="p-3 flex flex-col flex-grow min-w-0">
              <h3 className="text-sm font-semibold mb-1 transition-colors line-clamp-2 text-bwin-neutral-100 hover:text-bwin-brand-primary">
                {title}
              </h3>
              <div className="text-xs flex-grow text-bwin-neutral-80">
                <p className="line-clamp-2">
                  {getDescriptionSnippet(description, 80) || 'Sin descripción'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Vertical layout (original) */}
          <div className="hidden md:flex md:flex-col md:h-full">
            <div className="relative aspect-[3/2] w-full">
              {imageUrl && (
                <Image
                  src={mainImageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-sm md:text-xl font-semibold mb-2 transition-colors line-clamp-3 text-bwin-neutral-100 hover:text-bwin-brand-primary">
                {title}
              </h3>
              <div className="text-sm mb-2 text-bwin-neutral-80">
                <p className="line-clamp-3">
                  {getDescriptionSnippet(description, 120) || 'Sin descripción'}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs border-bwin-neutral-30">
                <div className="flex items-center gap-1">
                  {/* Author info removed for cleaner look */}
                </div>
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
    return <div className="py-8 text-center text-bwin-neutral-60">No se encontraron artículos</div>;
  }

  if (layout === 'fullWidth' && articles.length > 0) {
    const article = articles[0];
    if (!article) return null;

    const articleId = article._id || article.id;
    if (!articleId) return null;

    const articleUrl = getArticleUrl(article);
    const articleDate = article.created || article.date;
    const imageUrl = getImageUrl(article);
    const eventType = getEventType(article);
    const description = getDescription(article);
    const author = getAuthor(article);
    const title = getTitle(article);
    
    const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleId}`
    const mainImageUrl = `${mainImagePrefix}-${article.value?.["main_image_name"]}.png`

    return (
      <Card className="overflow-hidden border bg-bwin-neutral-20 border-bwin-neutral-30 hover:border-bwin-brand-primary/50 transition-colors">
        <Link
          href={articleUrl}
          prefetch={false}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:grid md:grid-cols-12 gap-0">
              <div className="md:col-span-6">
                <div className="relative aspect-[3/2] md:h-full w-full">
                  {imageUrl && (
                    <Image
                      src={mainImageUrl}
                      alt={title}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  )}
                </div>
              </div>
              <div className="md:col-span-6 p-4 md:p-8 flex flex-col">
                <div className="space-y-3">
                  <h2 className="text-lg md:text-3xl font-bold line-clamp-3 transition-colors text-bwin-neutral-100 hover:text-bwin-brand-primary">
                    {title}
                  </h2>

                  <div className="prose prose-sm prose-neutral max-w-none md:line-clamp-5 text-bwin-neutral-80">
                    <ReactMarkdown>
                      {getDescriptionSnippet(description, 360) || 'Sin descripción'}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-1 pt-4">
                  <div className="flex items-center gap-2">
                    {/* Author info removed for cleaner look */}
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-bwin-neutral-70">
                    <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-1 text-bwin-brand-primary" />
                    {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale: es }) : 'Reciente'}
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
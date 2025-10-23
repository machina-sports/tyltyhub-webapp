"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from 'react-markdown'
import { Article } from "@/providers/article/reducer"
import { cn } from "@/lib/utils"
import { useBrand } from "@/contexts/brand-context"
import { useBrandLocale, useBrandTexts, useBrandTextColors } from "@/hooks/use-brand-locale"

interface ArticleGridProps {
  articles: Article[]
  layout?: 'fullWidth' | 'threeCards'
}

const getImageUrl = (article: Article): string => {
  if (!article?.value) return '';
  
  const imageAddress = "" // process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

  if (article?.value?.image_path) {
    return `${article.value.image_path}`;
  }

  const mainImageName = article.value?.["main_image_name"];
  const articleId = article._id || article.id;

  if (imageAddress && mainImageName && articleId) {
    return `article-image-id-${articleId}-${mainImageName}.png`;
  } else if (imageAddress && article.value?.image_path) {
    return `${article.value.image_path}`;
  }
  
  return '';
};

const getTitle = (article: Article): string => {
  return article?.value?.title || 'Sin título';
};

const getDescription = (article: Article): string => {
  return article?.value?.subtitle || article?.value?.section_1_content || 'Sin descripción';
};

const getAuthor = (article: Article, brandDisplayName: string): string => {
  return brandDisplayName;
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
  const { brand } = useBrand();
  const locale = useBrandLocale();
  const brandTexts = useBrandTexts();
  const textColors = useBrandTextColors();
  if (!article) return null;

  const articleId = article._id || article.id;
  if (!articleId) return null;

  const articleUrl = getArticleUrl(article);
  const articleDate = article.created || article.date;
  const imageUrl = getImageUrl(article);
  const eventType = getEventType(article);
  const description = getDescription(article);
  const author = getAuthor(article, brand.displayName);
  const title = getTitle(article);

  const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleId}`
  // const mainImageUrl = `${mainImagePrefix}-${article.value?.["main_image_name"]}.png`
  const mainImageUrl = getImageUrl(article);

  return (
    <Card className="overflow-hidden border-2 bg-card border-muted hover:border-primary hover:bg-muted/30 transition-colors">
      <div className="h-full">
        <CardContent className="p-0 flex flex-col md:flex-col h-full">
          {/* Mobile: Horizontal layout with image on left */}
          <div className="flex md:hidden">
            <Link href={articleUrl} prefetch={false} className="relative w-32 h-24 flex-shrink-0 cursor-pointer">
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
            </Link>
            <div className="p-3 flex flex-col flex-grow min-w-0">
              <h3 className="text-base font-semibold mb-1 line-clamp-2">
                <Link href={articleUrl} prefetch={false} className="text-foreground hover:text-primary transition-colors">
                  {title}
                </Link>
              </h3>
              <div className={cn(
                "text-xs flex-grow",
                textColors.muted
              )}>
                <p className="line-clamp-2">
                  {getDescriptionSnippet(description, 80) || brandTexts.noDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Vertical layout (original) */}
          <div className="hidden md:flex md:flex-col md:h-full">
            <Link href={articleUrl} prefetch={false} className="relative aspect-[3/2] w-full block cursor-pointer">
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
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-sm md:text-2xl font-semibold mb-2 line-clamp-3">
                <Link href={articleUrl} prefetch={false} className="text-foreground hover:text-primary transition-colors">
                  {title}
                </Link>
              </h3>
              <div className={cn(
                "text-sm mb-2",
                textColors.muted
              )}>
                <p className="line-clamp-3">
                  {getDescriptionSnippet(description, 120) || brandTexts.noDescription}
                </p>
              </div>
              <div className="flex items-center mt-2 pt-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 mr-1 text-primary" />
                {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale }) : brandTexts.recent}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export function ArticleGrid({ articles, layout = 'threeCards' }: ArticleGridProps) {
  const { brand } = useBrand()
  const locale = useBrandLocale();
  const brandTexts = useBrandTexts();
  const textColors = useBrandTextColors();
  if (!articles || articles.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">{brandTexts.noArticles}</div>;
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
    const author = getAuthor(article, brand.displayName);
    const title = getTitle(article);
    
    const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleId}`
    // const mainImageUrl = `${mainImagePrefix}-${article.value?.["main_image_name"]}.png`
    const mainImageUrl = getImageUrl(article);

    return (
      <Card className="overflow-hidden border-2 bg-card border-muted hover:border-primary hover:bg-muted/30 transition-colors rounded-lg">
        <CardContent className="p-0">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-0">
            <div className="md:col-span-6">
              <Link href={articleUrl} prefetch={false} className="relative aspect-[3/2] md:h-full w-full block cursor-pointer">
                {imageUrl && (
                  <Image
                    src={mainImageUrl}
                    alt={title}
                    fill
                    className="object-cover rounded-l-lg"
                    priority
                  />
                )}
              </Link>
            </div>
            <div className="md:col-span-6 p-4 md:p-8 flex flex-col">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold line-clamp-3">
                  <Link href={articleUrl} prefetch={false} className="text-foreground hover:text-primary transition-colors">
                    {title}
                  </Link>
                </h2>

                <div className={cn(
                  "prose prose-sm prose-neutral max-w-none md:line-clamp-5",
                  textColors.muted
                )}>
                  <ReactMarkdown>
                    {getDescriptionSnippet(description, 360) || brandTexts.noDescription}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-1 pt-4">
                <div className="flex items-center gap-2">
                  {/* Author info removed for cleaner look */}
                </div>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                  <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-1 text-primary" />
                  {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale }) : brandTexts.recent}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
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
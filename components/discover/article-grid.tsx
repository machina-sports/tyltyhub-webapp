"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import { Article } from "@/providers/article/reducer"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ArticleGridProps {
  articles: Article[]
  layout?: 'fullWidth' | 'threeCards'
}

const unescapeMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

const getDescriptionSnippet = (description: string | undefined | null, maxLength: number = 150) => {
  if (!description) return '';

  const unescapedDescription = unescapeMarkdown(description);

  const firstParagraph = unescapedDescription.split('\n\n')[0];

  if (firstParagraph.length <= maxLength) return firstParagraph;

  return firstParagraph.slice(0, maxLength) + '...';
};

const getImageUrl = (article: Article): string => {
  if (!article) return '';

  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

  if (article.value?.image_path) {
    return `${imageAddress}/${article.value.image_path}`;
  }

  const title = article.value?.title || 'Article';
  return `https://placehold.co/800x450/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

const getEventType = (article: Article): string => {
  if (!article || !article.metadata) return 'Notícias';

  // For soccer games, return "Futebol"
  if (article.metadata.event_type === 'soccer-game') {
    return 'Futebol';
  }

  // For competition names, make them more readable
  if (article.metadata.competition) {
    switch (article.metadata.competition) {
      case 'sr:competition:17':
        return 'Premier League';
      case 'sr:competition:384':
        return 'Libertadores';
      case 'sr:competition:390':
        return 'Brasileiro Série B';
      default:
        return article.metadata.competition;
    }
  }

  return 'Notícias';
};

const getDescription = (article: Article): string => {
  if (!article || !article.value) return '';

  // Try to get content from any of the sections
  return article.value.section_1_content ||
    article.value.subtitle ||
    article.value.section_2_content ||
    '';
};

const getTitle = (article: Article): string => {
  if (!article || !article.value) return 'Sem título';
  return article.value.title || 'Sem título';
};

const getAuthor = (article: Article): string => {
  return 'Machina Sports';
};

const getArticleUrl = (article: Article): string => {
  if (!article) return '/discover';

  if (article.value?.slug) {
    return `/discover/${article.value.slug}`;
  }

  return `/discover/${article._id || article.id}`;
};

const ArticleCard = ({ article }: { article: Article }) => {
  const { isDarkMode } = useTheme();
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
    <Card className={cn(
      "overflow-hidden border", 
      isDarkMode 
        ? "bg-[#061F3F] border-[#45CAFF]/30 hover:border-[#45CAFF]/50" 
        : "hover:border-primary/30"
    )}>
      <Link
        href={articleUrl}
        className="h-full block"
        prefetch={false}
      >
        <CardContent className="p-0 flex flex-col h-full">
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
            <h3 className={cn("text-sm md:text-xl font-semibold mb-2 transition-colors line-clamp-3",
              isDarkMode
                ? "text-[#D3ECFF] hover:text-[#45CAFF]"
                : "hover:text-primary"
            )}>
              {title}
            </h3>
            <div className={cn(
              "text-sm mb-2",
              isDarkMode ? "text-[#D3ECFF]/80" : "text-muted-foreground"
            )}>
              <p className="line-clamp-3">
                {getDescriptionSnippet(description, 120) || 'Sem descrição'}
              </p>
            </div>
            <div className={cn(
              "flex items-center justify-between mt-2 pt-2 border-t text-xs",
              isDarkMode && "border-[#45CAFF]/30"
            )}>
              <div className="flex items-center gap-1">
                {/* <div className={cn("h-4 w-4 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-medium",
                  isPalmeirasTheme ? "bg-[#E8F5EE]" : "bg-secondary"
                )}>
                </div>
                <span className="text-muted-foreground truncate max-w-[85px]">{author}</span> */}
              </div>
            </div>
            <div className={cn(
              "flex items-center whitespace-nowrap text-xs mt-2",
              isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
            )}>
              <CalendarDays className={cn(
                "h-4 w-4 mr-2",
                isDarkMode && "text-[#45CAFF]"
              )} />
              {articleDate ? formatDistanceToNow(new Date(articleDate), { addSuffix: true, locale: ptBR }) : 'Recente'}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export function ArticleGrid({ articles, layout = 'threeCards' }: ArticleGridProps) {
  const { isDarkMode } = useTheme();
  if (!articles || articles.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">Nenhum artigo encontrado</div>;
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
      <Card className={cn(
        "overflow-hidden border", 
        isDarkMode 
          ? "bg-[#061F3F] border-[#45CAFF]/30 hover:border-[#45CAFF]/50" 
          : "hover:border-primary/30"
      )}>
        <Link
          href={articleUrl}
          target="_blank"
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
                  <h1 className={cn(
                    "text-lg md:text-3xl font-bold line-clamp-3 transition-colors",
                    isDarkMode
                      ? "text-[#D3ECFF] hover:text-[#45CAFF]"
                      : "hover:text-primary"
                  )}>
                    {title}
                  </h1>

                  <div className={cn(
                    "prose prose-sm prose-neutral max-w-none md:line-clamp-5",
                    isDarkMode ? "prose-invert text-[#D3ECFF]/80" : ""
                  )}>
                    <ReactMarkdown>
                      {getDescriptionSnippet(description, 360) || 'Sem descrição'}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-1 pt-4">
                  <div className="flex items-center gap-2">
                    {/* <div className="h-5 w-5 rounded-full overflow-hidden flex items-center justify-center text-xs font-medium bg-secondary">
                      {author ? author.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">{author}</span> */}
                  </div>
                  <div className={cn(
                    "flex items-center text-xs md:text-sm",
                    isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
                  )}>
                    <CalendarDays className={cn(
                      "h-3 w-3 md:h-4 md:w-4 mr-1",
                      isDarkMode && "text-[#45CAFF]"
                    )} />
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
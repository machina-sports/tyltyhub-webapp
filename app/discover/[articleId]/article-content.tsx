"use client";
import { useEffect, useState, useRef, useMemo, useCallback, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import Image from "next/image";
import { ArticleVoting } from "@/components/article/article-voting";
import { ArticleSharing } from "@/components/article/article-sharing";
import { RelatedArticles } from "@/components/article/related-articles";
import { ArticleSkeleton } from "@/components/article/article-skeleton";
import FollowUpQuestionForm from "@/components/follow-up-question";
import ReactMarkdown from 'react-markdown';
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import { doFetchArticle, doFetchRelatedArticles } from "@/providers/article/actions";
import { Clock, Eye } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the WidgetEmbed component to improve initial load time
const WidgetEmbed = dynamic(() => import("../../../components/article/widget-embed"), {
  loading: () => <div className="h-60 w-full bg-muted/30 rounded-md animate-pulse"></div>,
  ssr: false // Disable server-side rendering for this component
});

const unescapeMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

const getImageUrl = (article: any): string => {
  if (!article) return '';
  
  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;
  
  if (article.metadata?.event_code) {
    // For articles, we use the event_code to construct the image URL
    return `${imageAddress}/image-preview-${article.metadata.event_code}.webp`;
  }
  
  const title = article.value?.title || 'Article';
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

const getEventType = (article: any): string => {
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

const getReadTime = (article: any): string => {
  if (!article) return '3 min';
  if (article.readTime) return article.readTime;
  
  // Calculate read time based on section content length
  if (article.value) {
    let content = '';
    
    for (let i = 1; i <= 5; i++) {
      const sectionContent = article.value[`section_${i}_content`];
      if (sectionContent) {
        content += ' ' + sectionContent;
      }
    }
    
    // Average reading speed: 200 words per minute
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTimeMinutes} min`;
  }
  
  return '3 min';
};

interface ArticleContentProps {
  articleParam: string;
}

export default function ArticleContent({ articleParam }: ArticleContentProps) {
  const dispatch = useAppDispatch();
  const articles = useGlobalState((state: any) => state.article);
  const article = articles.currentArticle;
  const [views, setViews] = useState<number>(0);
  const hasIncrementedViews = useRef(false);
  const hasLoadedArticle = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (articleParam && !hasLoadedArticle.current) {
      setIsLoading(true);
      dispatch(doFetchArticle(articleParam))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
      hasLoadedArticle.current = true;
    }
  }, [dispatch, articleParam]);

  useEffect(() => {
    if (article && !hasIncrementedViews.current) {
      const articleId = article._id || article.id;
      setViews(article.views || 0);
      if (article.metadata) {
        dispatch(doFetchRelatedArticles({
          eventType: article.metadata.event_type,
          competition: article.metadata.competition,
          language: article.metadata.language
        }));
      }
      hasIncrementedViews.current = true;
    }
  }, [article, dispatch]);

  useEffect(() => {
    hasIncrementedViews.current = false;
    hasLoadedArticle.current = false;
    setIsLoading(true);
  }, [articleParam]);

  const articleData = useMemo(() => {
    if (!article) return null;
    
    return {
      imageUrl: getImageUrl(article),
      eventType: getEventType(article),
      readTime: getReadTime(article),
      title: article.value?.title || 'Sem título',
      subtitle: article.value?.subtitle || '',
      sections: Array.from({length: 5}, (_, i) => {
        const index = i + 1;
        const title = article.value?.[`section_${index}_title`];
        const content = article.value?.[`section_${index}_content`];
        return title && content ? { title, content } : null;
      }).filter(Boolean),
      createdDate: article.created || article.date,
      articleId: (article._id || article.id || '').toString(),
      eventDetails: article.value?.["event-details"],
      widgetEmbed: article.value?.["widget-match-embed"],
      slug: article.value?.slug
    };
  }, [article]);

  // Show skeleton during initial load
  if (isLoading || articles.loading) {
    return <ArticleSkeleton />;
  }

  if (!article || !articleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-32 sm:pb-36 space-y-6 sm:space-y-8">
      {articleData.imageUrl && (
        <div className="relative h-[200px] sm:h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={articleData.imageUrl}
            alt={articleData.title}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
            loading="eager"
          />
        </div>
      )}

      <div className="space-y-6">
        <Badge variant="secondary">{articleData.eventType}</Badge>

        <h1 className="text-2xl sm:text-4xl font-bold">{articleData.title}</h1>
        
        {articleData.subtitle && (
          <p className="text-lg text-muted-foreground">{articleData.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-sm font-medium">
                M
              </div>
              <span>Machina Sports</span>
            </div>
            <span>·</span>
            <span>
              {articleData.createdDate ? 
                formatDistanceToNow(new Date(articleData.createdDate), { addSuffix: true, locale: ptBR }) : 
                'Recente'
              }
            </span>
            <span>·</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {articleData.readTime}
            </span>
            <span>·</span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {views || 0} visualizações
            </span>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <ArticleSharing 
              articleId={articleData.articleId}
              title={articleData.title} 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/discover/${articleData.slug || articleData.articleId}`} 
            />
          </div>
        </div>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* Event Details if available */}
        {articleData.eventDetails && (
          <div className="bg-secondary/20 p-4 rounded-lg mb-6">
            <h3>Detalhes do Evento</h3>
            <ul>
              {articleData.eventDetails.match && (
                <li><strong>Partida:</strong> {articleData.eventDetails.match}</li>
              )}
              {articleData.eventDetails.venue && (
                <li><strong>Local:</strong> {articleData.eventDetails.venue}</li>
              )}
              {articleData.eventDetails.when && (
                <li><strong>Data:</strong> {articleData.eventDetails.when}</li>
              )}
            </ul>
          </div>
        )}
        
        {articleData.sections.map((section: any, index: number) => (
          <div key={index} className="mb-6">
            <h2>{section.title}</h2>
            <ReactMarkdown>
              {unescapeMarkdown(section.content)}
            </ReactMarkdown>
          </div>
        ))}
        
        {articleData.widgetEmbed && (
          <Suspense fallback={<div className="h-60 w-full bg-muted/30 rounded-md animate-pulse"></div>}>
            <WidgetEmbed embedCode={articleData.widgetEmbed} />
          </Suspense>
        )}
      </div>

      <Separator />

      <ArticleVoting articleId={articleData.articleId} />

      <Separator />

      <RelatedArticles currentArticleId={articleData.articleId} />

      <FollowUpQuestionForm />
    </div>
  );
} 
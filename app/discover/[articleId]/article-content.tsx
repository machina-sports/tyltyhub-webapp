"use client";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import Image from "next/image";
import { ArticleVoting } from "@/components/article/article-voting";
import { ArticleSharing } from "@/components/article/article-sharing";
import { RelatedArticles } from "@/components/article/related-articles";
import FollowUpQuestionForm from "@/components/follow-up-question";
import ReactMarkdown from 'react-markdown';
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import { fetchArticleById, fetchRelatedArticles, incrementViews } from "@/store/slices/articlesSlice";
import { config } from "@/libs/config";
import { Clock, Eye } from "lucide-react";

// Helper function to unescape common sequences in the JSON string
const unescapeMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

// Helper to get an image URL based on the article data
const getImageUrl = (article: any): string => {
  if (!article) return '';
  
  // Get image address from config
  const imageAddress = config.IMAGE_CONTAINER_ADDRESS;
  
  // Check if we have event_code in metadata
  if (article.metadata?.event_code) {
    // For articles, we use the event_code to construct the image URL
    return `${imageAddress}/image-preview-${article.metadata.event_code}.webp`;
  }
  
  // Fallback to placeholder if no event_code
  const title = article.value?.title || 'Article';
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

// Get event type from metadata or default to "Notícias"
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

// Helper to get read time
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
  articleParam: string; // Can be either a slug or an ID
}

export default function ArticleContent({ articleParam }: ArticleContentProps) {
  const dispatch = useAppDispatch();
  const { articles } = useGlobalState();
  const article = articles.currentArticle;
  const [views, setViews] = useState<number>(0);
  const hasIncrementedViews = useRef(false);

  useEffect(() => {
    if (articleParam) {
      dispatch(fetchArticleById(articleParam));
    }
  }, [dispatch, articleParam]);

  useEffect(() => {
    if (article && !hasIncrementedViews.current) {
      // Get current article ID
      const articleId = article._id || article.id;
      
      // Set the local views state
      setViews(article.views || 0);
      
      // Fetch related articles only once when article loads
      if (article.metadata) {
        dispatch(fetchRelatedArticles({
          eventType: article.metadata.event_type,
          competition: article.metadata.competition,
          language: article.metadata.language
        }));
      }
      
      // Increment views only once per article load
      if (articleId) {
        dispatch(incrementViews(articleId));
        hasIncrementedViews.current = true;
      }
    }
  }, [article, dispatch]);

  // Reset the view increment flag when article param changes
  useEffect(() => {
    hasIncrementedViews.current = false;
  }, [articleParam]);

  if (articles.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl font-medium">Carregando artigo...</h1>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
      </div>
    );
  }
  
  const imageUrl = getImageUrl(article);
  const eventType = getEventType(article);
  const readTime = getReadTime(article);
  const title = article.value?.title || 'Sem título';
  const subtitle = article.value?.subtitle || '';
  
  // Format article content from sections
  const sections = [];
  for (let i = 1; i <= 5; i++) {
    const sectionTitle = article.value?.[`section_${i}_title`];
    const sectionContent = article.value?.[`section_${i}_content`];
    
    if (sectionTitle && sectionContent) {
      sections.push({ title: sectionTitle, content: sectionContent });
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-32 sm:pb-36 space-y-6 sm:space-y-8">
      {imageUrl && (
        <div className="relative h-[200px] sm:h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <div className="space-y-6">
        <Badge variant="secondary">{eventType}</Badge>

        <h1 className="text-2xl sm:text-4xl font-bold">{title}</h1>
        
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
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
              {article.created || article.date ? 
                formatDistanceToNow(new Date(article.created || article.date || new Date()), { addSuffix: true, locale: ptBR }) : 
                'Recente'
              }
            </span>
            <span>·</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readTime}
            </span>
            <span>·</span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {views || 0} visualizações
            </span>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <ArticleSharing 
              articleId={(article._id || article.id || '').toString()}
              title={title} 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/discover/${article.value?.slug || article._id || article.id || ''}`} 
            />
          </div>
        </div>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* Event Details if available */}
        {article.value?.["event-details"] && (
          <div className="bg-secondary/20 p-4 rounded-lg mb-6">
            <h3>Detalhes do Evento</h3>
            <ul>
              {article.value["event-details"].match && (
                <li><strong>Partida:</strong> {article.value["event-details"].match}</li>
              )}
              {article.value["event-details"].venue && (
                <li><strong>Local:</strong> {article.value["event-details"].venue}</li>
              )}
              {article.value["event-details"].when && (
                <li><strong>Data:</strong> {article.value["event-details"].when}</li>
              )}
            </ul>
          </div>
        )}
        
        {/* Article sections */}
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2>{section.title}</h2>
            <ReactMarkdown>
              {unescapeMarkdown(section.content)}
            </ReactMarkdown>
          </div>
        ))}
        
        {/* Widget embed if available */}
        {article.value?.["widget-match-embed"] && (
          <div className="my-8" dangerouslySetInnerHTML={{ 
            __html: JSON.parse(article.value["widget-match-embed"])[0]?.embed || ''
          }} />
        )}
      </div>

      <Separator />

      <ArticleVoting articleId={(article._id || article.id || '').toString()} />

      <Separator />

      <RelatedArticles currentArticleId={(article._id || article.id || '').toString()} />

      <FollowUpQuestionForm />
    </div>
  );
} 
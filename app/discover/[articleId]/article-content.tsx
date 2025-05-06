"use client";
import { useEffect } from "react";
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
import { fetchArticleById } from "@/store/slices/articlesSlice";
import { config } from "@/libs/config";

// Helper function to unescape common sequences in the JSON string
const unescapeMarkdown = (text: string): string => {
  return text ? text.replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';
};

// Helper to get a valid image URL
const getImageUrl = (article: any): string => {
  if (!article) return '';
  
  if (article.image) {
    return article.image;
  }
  
  if (article.image_url) {
    return `${config.IMAGE_CONTAINER_ADDRESS}/${article.image_url}`;
  }
  
  return '';
};

interface ArticleContentProps {
  articleId: string;
}

export default function ArticleContent({ articleId }: ArticleContentProps) {
  const dispatch = useAppDispatch();
  const { articles } = useGlobalState();
  const article = articles.currentArticle;

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [dispatch, articleId]);

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

  // Unescape the description before rendering
  const unescapedDescription = unescapeMarkdown(article.content || article.description);
  const imageUrl = getImageUrl(article);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-32 sm:pb-36 space-y-6 sm:space-y-8">
      {imageUrl && (
        <div className="relative h-[200px] sm:h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={article.title || 'Article Image'}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <div className="space-y-6">
        {article.category && <Badge variant="secondary">{article.category}</Badge>}

        <h1 className="text-2xl sm:text-4xl font-bold">{article.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary" />
                <span>{article.author}</span>
              </div>
            )}
            {article.author && <span>·</span>}
            <span>
              {article.createdAt || article.date ? 
                formatDistanceToNow(new Date(article.createdAt || article.date), { addSuffix: true, locale: ptBR }) : 
                'Recente'
              }
            </span>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <ArticleSharing 
              articleId={article._id || article.id} 
              title={article.title} 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/discover/${article._id || article.id}`} 
            />
          </div>
        </div>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>
          {unescapedDescription}
        </ReactMarkdown>
      </div>

      <Separator />

      <ArticleVoting articleId={article._id || article.id} />

      <Separator />

      <RelatedArticles currentArticleId={article._id || article.id} />

      <FollowUpQuestionForm />
    </div>
  );
} 
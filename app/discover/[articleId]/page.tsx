import { ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ArticleVoting } from "@/components/article/article-voting";
import { RelatedArticles } from "@/components/article/related-articles";
import discoverData from "@/data/discover.json";
import FollowUpQuestionForm from "@/components/follow-up-question";

export function generateStaticParams() {
  const articles = [discoverData.featured, ...discoverData.articles];
  return articles.map((article) => ({
    articleId: article.id,
  }));
}

interface ArticlePageProps {
  params: {
    articleId: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article =
    discoverData.articles.find((a) => a.id === params.articleId) ||
    (discoverData.featured.id === params.articleId
      ? discoverData.featured
      : null);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-20 sm:pb-24 space-y-6 sm:space-y-8">
      <div className="relative h-[200px] sm:h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="space-y-6">
        <Badge variant="secondary">{article.category}</Badge>

        <h1 className="text-2xl sm:text-4xl font-bold">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary" />
            <span>{article.author}</span>
          </div>
          <span>·</span>
          <span>
            {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
          </span>
          <span>·</span>
          <span>{article.readTime}</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>1.2k views</span>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {article.description}
      </div>

      <Separator />

      <ArticleVoting articleId={article.id} />

      <Separator />

      <RelatedArticles currentArticleId={article.id} />

      <FollowUpQuestionForm />
    </div>
  );
}
"use client";
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { ArticleVoting } from "@/components/article/article-voting";
import { ArticleSharing } from "@/components/article/article-sharing";
import { RelatedArticles } from "@/components/article/related-articles";
import { ArticleSkeleton } from "@/components/article/article-skeleton";
// import FollowUpQuestionForm from "@/components/follow-up-question";
import ReactMarkdown from "react-markdown";
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import {
  doFetchArticle,
  doFetchRelatedArticles,
} from "@/providers/article/actions";
import { Clock, Eye } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the WidgetEmbed component to improve initial load time
const WidgetEmbed = dynamic(
  () => import("../../../components/article/widget-embed"),
  {
    loading: () => (
      <div className="h-60 w-full bg-muted/30 rounded-md animate-pulse"></div>
    ),
    ssr: false, // Disable server-side rendering for this component
  }
);

const unescapeMarkdown = (text: string | undefined | null): string => {
  if (!text) return "";
  return text.replace(/\\n/g, "\n").replace(/\\"/g, '"');
};

const getImageUrl = (article: any): string => {
  if (!article) return "";

  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

  if (article?.value?.image_path) {
    return `${imageAddress}/${article.value.image_path}`;
  }

  const title = article.value?.title || "Article";
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(
    title
  )}`;
};

const getEventType = (article: any): string => {
  if (!article || !article.metadata) return "Notícias";

  // For soccer games, return "Futebol"
  if (article.metadata.event_type === "soccer-game") {
    return "Futebol";
  }

  // For competition names, make them more readable
  if (article.metadata.competition) {
    switch (article.metadata.competition) {
      case "sr:competition:17":
        return "Premier League";
      case "sr:competition:384":
        return "Libertadores";
      case "sr:competition:390":
        return "Brasileiro Série B";
      default:
        return article.metadata.competition;
    }
  }

  return "Notícias";
};

const getReadTime = (article: any): string => {
  if (!article) return "3 min";
  if (article.readTime) return article.readTime;

  // Calculate read time based on section content length
  if (article.value) {
    let content = "";

    for (let i = 1; i <= 5; i++) {
      const sectionContent = article.value[`section_${i}_content`];
      if (sectionContent) {
        content += " " + sectionContent;
      }
    }

    // Average reading speed: 200 words per minute
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTimeMinutes} min`;
  }

  return "3 min";
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
        dispatch(
          doFetchRelatedArticles({
            eventType: article.metadata.event_type,
            competition: article.metadata.competition,
            language: article.metadata.language,
          })
        );
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
      ...article,
      imageUrl: getImageUrl(article),
      eventType: getEventType(article),
      readTime: getReadTime(article),
      title: article.value?.title || "Sem título",
      subtitle: article.value?.subtitle || "",
      section_1_title: article.value?.["section_1_title"] || "",
      section_1_content: article.value?.["section_1_content"] || "",
      section_2_title: article.value?.["section_2_title"] || "",
      section_2_content: article.value?.["section_2_content"] || "",
      section_3_title: article.value?.["section_3_title"] || "",
      section_3_content: article.value?.["section_3_content"] || "",
      section_4_title: article.value?.["section_4_title"] || "",
      section_4_content: article.value?.["section_4_content"] || "",
      section_5_title: article.value?.["section_5_title"] || "",
      section_5_content: article.value?.["section_5_content"] || "",
      createdDate: article.created || article.date,
      articleId: (article._id || article.id || "").toString(),
      eventDetails: article.value?.["event-details"],
      widgetEmbed: article.value?.["widget-match-embed"],
      slug: article.value?.slug,
      imagePath: article?.value?.["image_path"],
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

  const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleData?.["_id"]}`
  
  const mainImageUrl = `${mainImagePrefix}-${articleData?.value?.["main_image_name"]}.png`

  const section1ImageUrl = `${mainImagePrefix}-${articleData?.value?.["section_1_image"]}.png`
  
  const section2ImageUrl = `${mainImagePrefix}-${articleData?.value?.["section_2_image"]}.png`
  
  const section3ImageUrl = `${mainImagePrefix}-${articleData?.value?.["section_3_image"]}.png`
  
  const section4ImageUrl = `${mainImagePrefix}-${articleData?.value?.["section_4_image"]}.png`
  
  const section5ImageUrl = `${mainImagePrefix}-${articleData?.value?.["section_5_image"]}.png`

  const RenderImageComponent = ({ imageUrl, alt }: { imageUrl: string, alt: string }) => {
    return (
      <div className="relative w-full overflow-hidden rounded-lg aspect-[1560/1024]">
        <Image
          src={imageUrl}
          alt={alt}
          fill={true}
          className="object-cover object-center m-0"
          priority
          loading="eager"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-32 sm:pb-36 space-y-6 sm:space-y-8">

      <RenderImageComponent imageUrl={mainImageUrl} alt={articleData.title} />

      <div className="space-y-6">
        {/* <Badge variant="secondary">{articleData.eventType}</Badge> */}

        <h1 className="text-2xl sm:text-4xl font-bold">{articleData.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {articleData.subtitle && (
              <p className="text-lg text-muted-foreground mb-2">
                {articleData.subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <span className="flex items-center">
                Publicado {"\n"}
                {articleData.createdDate
                  ? formatDistanceToNow(new Date(articleData.createdDate), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                  : "Recente"}
              </span>
              <Clock className="h-4 w-4" />
              <span>{articleData.readTime}</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
          </div>
        </div>
        <ArticleSharing
          articleId={articleData.articleId}
          title={articleData.title}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/discover/${articleData.slug || articleData.articleId}`}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="prose-container">
          <h2 className="text-lg font-bold mt-8 mb-8"></h2>
          {articleData.widgetEmbed && (
            <Suspense
              fallback={
                <div className="h-60 w-full bg-muted/30 rounded-md animate-pulse"></div>
              }
            >
              <WidgetEmbed embedCode={articleData.widgetEmbed} />
            </Suspense>
          )}
          {articleData?.["eventDetails"]?.when &&
            articleData?.["eventDetails"]?.venue &&
            articleData?.["eventDetails"]?.match && (
              <>
                <p className="text-lg mb-1">
                  {articleData?.["event_type"] === "nba-game" ? "🏀" : "⚽"}{" "}
                  {articleData?.["eventDetails"]?.match}
                </p>
                <p className="text-lg mb-1">
                  🕒 {articleData?.["eventDetails"]?.when}
                </p>
                <p className="text-lg mb-1">
                  🏟️ {articleData?.["eventDetails"]?.venue}
                </p>
              </>
            )}
          <h2 className="text-2xl font-bold mt-12 mb-8">
            {articleData.section_1_title}
          </h2>
          <p className="text-lg mt-8">{articleData.section_1_content}</p>
          
          <RenderImageComponent imageUrl={section1ImageUrl} alt={articleData?.["section_1_title"]} />

          <h2 className="text-2xl font-bold mt-12 mb-8">
            {articleData.section_2_title}
          </h2>
          <p className="text-lg mt-8">{articleData.section_2_content}</p>
          <RenderImageComponent imageUrl={section2ImageUrl} alt={articleData?.["section_2_title"]} />

          <h2 className="text-2xl font-bold mt-12 mb-8">
            {articleData.section_3_title}
          </h2>
          <p className="text-lg mt-8">{articleData.section_3_content}</p>
          <RenderImageComponent imageUrl={section3ImageUrl} alt={articleData?.["section_3_title"]} />

          <h2 className="text-2xl font-bold mt-12 mb-8">
            {articleData.section_4_title}
          </h2>
          <p className="text-lg mt-8">{articleData.section_4_content}</p>
          <RenderImageComponent imageUrl={section4ImageUrl} alt={articleData?.["section_4_title"]} />

          <h2 className="text-2xl font-bold mt-12 mb-8">
            {articleData.section_5_title}
          </h2>
          <p className="text-lg mt-8">{articleData.section_5_content}</p>
          <RenderImageComponent imageUrl={section5ImageUrl} alt={articleData?.["section_5_title"]} />
        </div>
      </div>

      <Separator />

      <ArticleVoting articleId={articleData.articleId} />

      <Separator />

      <RelatedArticles currentArticleId={articleData.articleId} />

      {/* <FollowUpQuestionForm /> */}
    </div>
  );
}

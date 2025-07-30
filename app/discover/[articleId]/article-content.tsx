"use client";
import React from "react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { ArticleVoting } from "@/components/article/article-voting";
import { ArticleSharing } from "@/components/article/article-sharing";
import { RelatedArticles } from "@/components/article/related-articles";
import { RelatedOdds } from "@/components/article/related-odds";
import { ArticleSkeleton } from "@/components/article/article-skeleton";
// import FollowUpQuestionForm from "@/components/follow-up-question";
import ReactMarkdown from "react-markdown";
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import {
  doFetchArticle,
  doFetchRelatedArticles,
} from "@/providers/article/actions";
import { Clock, Calendar, User } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { WidgetCarousel } from "@/components/carousel/container";

// // Dynamically import the WidgetEmbed component to improve initial load time
// const WidgetEmbed = dynamic(
//   () => import("../../../components/article/widget-embed"),
//   {
//     loading: () => (
//       <div className="h-60 w-full bg-muted/30 rounded-md animate-pulse"></div>
//     ),
//     ssr: false, // Disable server-side rendering for this component
//   }
// );
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

const WidgetEmbed = React.memo(({ content }: { content: string }) => (
  // <div dangerouslySetInnerHTML={{ __html: content?.replace(/\s*data-tallysight-widget-config-market=['"][^'"]*['"]/, '') }} />
  <div dangerouslySetInnerHTML={{ __html: content }} />
))
WidgetEmbed.displayName = 'WidgetEmbed'

interface ArticleContentProps {
  articleParam: string;
}

export default function ArticleContent({ articleParam }: ArticleContentProps) {
  const { isDarkMode } = useTheme();
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
      title: article.value?.title || "Sin título",
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
      oddsWidgets: {
        mainWidget: article.value?.["main-widget"] || [],
        secondWidget: article.value?.["second-widget"] || [],
        thirdWidget: article.value?.["third-widget"] || [],
        fourthWidget: article.value?.["fourth-widget"] || [],
        fifthWidget: article.value?.["fifth-widget"] || [],
      },
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
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
      </div>
    );
  }

  const mainImagePrefix = `${process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS}/article-image-id-${articleData?.["_id"]}`

  const mainImageUrl = `${mainImagePrefix}-${articleData?.value?.["main_image_name"]}.png`

  const hasTextImage = articleData?.metadata?.["content-group"] == "TEAM_ARTICLE"

  // Only construct URLs for sections that have images
  const section1ImageUrl = hasTextImage && articleData?.value?.["section_1_image"]
    ? `${mainImagePrefix}-${articleData.value["section_1_image"]}.png`
    : undefined;

  const section2ImageUrl = hasTextImage && articleData?.value?.["section_2_image"]
    ? `${mainImagePrefix}-${articleData.value["section_2_image"]}.png`
    : undefined;

  const section3ImageUrl = hasTextImage && articleData?.value?.["section_3_image"]
    ? `${mainImagePrefix}-${articleData.value["section_3_image"]}.png`
    : undefined;

  const section4ImageUrl = hasTextImage && articleData?.value?.["section_4_image"]
    ? `${mainImagePrefix}-${articleData.value["section_4_image"]}.png`
    : undefined;

  const section5ImageUrl = hasTextImage && articleData?.value?.["section_5_image"]
    ? `${mainImagePrefix}-${articleData.value["section_5_image"]}.png`
    : undefined;

  // Only using main image as per requirement to reduce visual clutter

  const RenderImageComponent = ({ imageUrl, alt }: { imageUrl: string | undefined, alt: string }) => {
    if (!imageUrl) return null;

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
      {/* Main heading for SEO - visually hidden but accessible */}
      <h1 className="sr-only">A Inteligência Artificial da Sportingbet</h1>

      <RenderImageComponent imageUrl={mainImageUrl} alt={articleData.title} />

      <div className="space-y-6">
        {/* <Badge variant="secondary">{articleData.eventType}</Badge> */}

        <h2 className={cn(
          "text-2xl sm:text-4xl font-bold",
          isDarkMode ? "text-[#fff]" : ""
        )}>
          {articleData.title}
        </h2>
        {/* Header Meta & Sharing */}
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-6 mb-6">
          {/* Meta information */}
          <div className="flex flex-col justify-center flex-1">
            {articleData.subtitle && (
              <p
                className={cn(
                  "text-base sm:text-lg",
                  isDarkMode ? "text-[#D3ECFF]/80" : "text-muted-foreground"
                )}
              >
                {articleData.subtitle}
              </p>
            )}

            <div
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm mt-6",
                isDarkMode ? "text-[#D3ECFF]/60" : "text-muted-foreground"
              )}
            >
              {/* Date */}
              <span className="flex items-center gap-1">
                <Calendar
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    isDarkMode && "text-[#45CAFF]"
                  )}
                />
                {articleData.createdDate
                  ? format(new Date(articleData.createdDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                  : "--/--/----"}
              </span>

              <span className="hidden sm:inline">•</span>

              <span className="flex items-center gap-1">
                <Clock
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    isDarkMode && "text-[#45CAFF]"
                  )}
                />
                {articleData.readTime}
              </span>

              <span className="hidden sm:inline">•</span>

              <span className="flex items-center gap-1 whitespace-nowrap">
                <User
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    isDarkMode && "text-[#45CAFF]"
                  )}
                />
                Bwin BOT
              </span>
            </div>
          </div>

          {/* Sharing – sits right side on desktop, below meta on mobile */}
          <div className="flex-shrink-0">
            <ArticleSharing
              articleId={articleData.articleId}
              title={articleData.title}
              url={`https://sportingbot.com/discover/${articleData.slug || articleData.articleId}`}
              shareImageUrl={mainImageUrl}
            />
          </div>
        </div>
      </div>

      <div className={cn(
        "prose prose-neutral max-w-none",
        isDarkMode ? "prose-invert text-[#D3ECFF]" : ""
      )}>
        <div className="prose-container">
          <h2 className={cn(
            "text-lg font-bold mt-8 mb-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}></h2>
          {articleData.widgetEmbed && (
            <div className={cn("mt-0", isDarkMode && "dark")}>
              <WidgetEmbed content={articleData.widgetEmbed} />
            </div>
          )}
          {articleData?.["eventDetails"]?.when &&
            articleData?.["eventDetails"]?.venue &&
            articleData?.["eventDetails"]?.match && (
              <>
                <p className={cn(
                  "text-lg mb-1",
                  isDarkMode ? "text-[#D3ECFF]" : ""
                )}>
                  {articleData?.["eventDetails"]?.match}
                </p>
                <p className={cn(
                  "text-lg mb-1",
                  isDarkMode ? "text-[#D3ECFF]" : ""
                )}>
                  {articleData?.["eventDetails"]?.when}
                </p>
                <p className={cn(
                  "text-lg mb-1",
                  isDarkMode ? "text-[#D3ECFF]" : ""
                )}>
                  {articleData?.["eventDetails"]?.venue}
                </p>
              </>
            )}
          <RenderImageComponent imageUrl={section1ImageUrl} alt={articleData?.["section_1_title"]} />
          {articleData?.oddsWidgets?.mainWidget && (
            <div className={cn("mt-8 pl-4 sm:pl-0 max-w-[420px]", isDarkMode && "dark")}>
              <WidgetCarousel widgets={articleData?.oddsWidgets?.mainWidget} isDarkMode={isDarkMode} />
            </div>
          )}
          <h2 className={cn(
            "text-2xl font-bold mt-8 mb-8",
            isDarkMode ? "text-[#fff]" : ""
          )}>
            {articleData.section_1_title}
          </h2>
          <p className={cn(
            "text-lg mt-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}>
            {articleData.section_1_content}
          </p>
          <RenderImageComponent imageUrl={section1ImageUrl} alt={articleData?.["section_1_title"]} />
          {articleData?.oddsWidgets?.mainWidget && (
            <div className={cn("mt-0 pl-4 sm:pl-0 max-w-[420px]", isDarkMode && "dark")}>
              <WidgetCarousel widgets={articleData?.oddsWidgets?.secondWidget} isDarkMode={isDarkMode} />
            </div>
          )}
          <h2 className={cn(
            "text-2xl font-bold mt-8 mb-8",
            isDarkMode ? "text-[#fff]" : ""
          )}>
            {articleData.section_2_title}
          </h2>
          <p className={cn(
            "text-lg mt-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}>
            {articleData.section_2_content}
          </p>
          <RenderImageComponent imageUrl={section2ImageUrl} alt={articleData?.["section_2_title"]} />
          {articleData?.oddsWidgets?.thirdWidget && (
            <div className={cn("mt-0 pl-4 sm:pl-0 max-w-[420px]", isDarkMode && "dark")}>
              <WidgetCarousel widgets={articleData?.oddsWidgets?.thirdWidget} isDarkMode={isDarkMode} />
            </div>
          )}
          <h2 className={cn(
            "text-2xl font-bold mt-8 mb-8",
            isDarkMode ? "text-[#fff]" : ""
          )}>
            {articleData.section_3_title}
          </h2>
          <p className={cn(
            "text-lg mt-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}>
            {articleData.section_3_content}
          </p>
          <RenderImageComponent imageUrl={section3ImageUrl} alt={articleData?.["section_3_title"]} />
          {articleData?.oddsWidgets?.fourthWidget && (
            <div className={cn("mt-0 pl-4 sm:pl-0 max-w-[420px]", isDarkMode && "dark")}>
              <WidgetCarousel widgets={articleData?.oddsWidgets?.fourthWidget} isDarkMode={isDarkMode} />
            </div>
          )}
          <h2 className={cn(
            "text-2xl font-bold mt-8 mb-8",
            isDarkMode ? "text-[#fff]" : ""
          )}>
            {articleData.section_4_title}
          </h2>
          <p className={cn(
            "text-lg mt-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}>
            {articleData.section_4_content}
          </p>
          <RenderImageComponent imageUrl={section4ImageUrl} alt={articleData?.["section_4_title"]} />
          {articleData?.oddsWidgets?.fifthWidget && (
            <div className={cn("mt-0 pl-4 sm:pl-0 max-w-[420px]", isDarkMode && "dark")}>
              <WidgetCarousel widgets={articleData?.oddsWidgets?.fifthWidget} isDarkMode={isDarkMode} />
            </div>
          )}
          <h2 className={cn(
            "text-2xl font-bold mt-8 mb-8",
            isDarkMode ? "text-[#fff]" : ""
          )}>
            {articleData.section_5_title}
          </h2>
          <p className={cn(
            "text-lg mt-8",
            isDarkMode ? "text-[#D3ECFF]" : ""
          )}>
            {articleData.section_5_content}
          </p>
          <RenderImageComponent imageUrl={section5ImageUrl} alt={articleData?.["section_5_title"]} />
        </div>
      </div>

      <Separator className={cn(isDarkMode ? "bg-[#45CAFF]/30" : "")} />

      <ArticleVoting articleId={articleData.articleId} />

      <Separator className={cn(isDarkMode ? "bg-[#45CAFF]/30" : "")} />

      <RelatedOdds currentArticleId={articleData.articleId} />

      <RelatedArticles currentArticleId={articleData.articleId} />

      {/* <FollowUpQuestionForm /> */}
    </div>
  );
}

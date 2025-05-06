import { config } from "@/libs/config";
import ArticleContent from "./article-content";

// Since we're using output: export mode, we need to provide this function
// for static site generation
export async function generateStaticParams() {
  try {
    const response = await fetch(`${config.MACHINA_CLIENT_URL.replace(/\/$/, '')}/document/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': config.MACHINA_API_KEY
      },
      body: JSON.stringify({
        filters: {
          "name": "content-article"
        },
        page: 1,
        page_size: 100
      })
    });
    
    const data = await response.json();
    
    if (data.status === true && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        // Use the slug if available, otherwise use ID
        articleId: (item.value && item.value.slug) ? item.value.slug : (item._id || item.id)
      }));
    }
    
    // Fallback if API fails: Return a dummy ID to satisfy NextJS
    return [{ articleId: "placeholder" }];
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    // Return a dummy ID to satisfy NextJS
    return [{ articleId: "placeholder" }];
  }
}

interface ArticlePageProps {
  params: {
    articleId: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  // The articleId param could be either a slug or an ID
  return <ArticleContent articleParam={params.articleId} />;
}
import ArticleContent from "./article-content";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.MACHINA_CLIENT_URL?.replace(/\/$/, '')}/document/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': process.env.MACHINA_API_KEY || ''
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
        articleId: (item.value && item.value.slug) ? item.value.slug : (item._id || item.id)
      }));
    }
    
    return [{ articleId: "placeholder" }];
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [{ articleId: "placeholder" }];
  }
}

interface ArticlePageProps {
  params: {
    articleId: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticleContent articleParam={params.articleId} />;
}
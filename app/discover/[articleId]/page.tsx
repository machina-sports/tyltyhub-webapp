import { Metadata } from "next";
import ArticleContent from "./article-content";

export async function generateMetadata({ params }: { params: { articleId: string } }): Promise<Metadata> {
  try {
    const articleId = params.articleId;
    // Check if it's a slug or ID
    const isObjectId = /^[0-9a-f]{24}$/i.test(articleId);
    
    const filters = isObjectId ? { "_id": articleId } : { "value.slug": articleId };
    
    const response = await fetch(`${process.env.MACHINA_CLIENT_URL?.replace(/\/$/, '')}/document/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': process.env.MACHINA_API_KEY || ''
      },
      body: JSON.stringify({
        filters,
        page: 1,
        page_size: 1
      }),
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const data = await response.json();
    const article = data?.data?.[0];
    
    if (article?.value) {
      return {
        title: article.value.title,
        description: article.value.subtitle || article.value.section_1_content,
        openGraph: {
          title: article.value.title,
          description: article.value.subtitle || article.value.section_1_content,
          type: 'article',
          publishedTime: article.created || article.date,
          authors: ['Machina Sports'],
        }
      };
    }
    
    return {
      title: 'Artigo | Machina Sports',
      description: 'Leia as últimas notícias e análises esportivas.'
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Artigo | Machina Sports',
      description: 'Leia as últimas notícias e análises esportivas.'
    };
  }
}

export async function generateStaticParams() {
  const pageSize = 30; // Get more articles for static generation
  const pages = 2; // Generate for first 2 pages of articles
  const articles = [];
  
  try {
    for (let page = 1; page <= pages; page++) {
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
          page,
          page_size: pageSize
        }),
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      const data = await response.json();
      
      if (data.status === true && Array.isArray(data.data)) {
        articles.push(
          ...data.data.map((item: any) => ({
            articleId: (item.value && item.value.slug) ? item.value.slug : (item._id || item.id)
          }))
        );
      }
      
      // If we got fewer articles than requested, there are no more pages
      if (!data.data || data.data.length < pageSize) {
        break;
      }
    }
    
    return articles.length > 0 ? articles : [{ articleId: "placeholder" }];
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
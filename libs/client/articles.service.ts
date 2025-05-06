import ClientBaseService from "@/libs/client/base.service"
import { config } from "@/libs/config"

interface ArticleData {
  _id?: string
  id?: string
  title?: string
  description?: string
  content?: string
  image?: string
  image_url?: string
  author?: string
  readTime?: string
  category?: string
  date?: string
  createdAt?: string
  [key: string]: any
}

class ArticlesService extends ClientBaseService {
  constructor() {
    super()
    this.prefix = `${config.MACHINA_CLIENT_URL.replace(/\/$/, '')}/document/search`
  }

  mapArticleData(article: ArticleData): ArticleData {
    
    let imageUrl = '';
    if (article.image) {
      imageUrl = article.image;
    } else if (article.image_url) {
      imageUrl = `${config.IMAGE_CONTAINER_ADDRESS}/${article.image_url}`;
    } else {
      // Create placeholder if no image
      const title = article.title || 'Article';
      imageUrl = `https://placehold.co/800x450/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
    }
    
    const mappedArticle = {
      _id: article._id || article.id,
      id: article._id || article.id,
      title: article.title || '',
      description: article.description || article.content || '',
      content: article.content || article.description || '',
      image: imageUrl,
      author: article.author || 'Machina Sports',
      readTime: article.readTime || '3 min',
      category: article.category || 'Notícias',
      date: article.date || article.createdAt || new Date().toISOString(),
      createdAt: article.createdAt || article.date || new Date().toISOString(),
    };
    
    return mappedArticle;
  }

  async getArticles() {
    try {
      
      const options = {
        headers: {
          "X-Api-Token": config.MACHINA_API_KEY,
          "Content-Type": "application/json",
        }
      }

      const body = {
        "filters": {
          "name": "content-article"
        },
        "sorters": [
          "_id",
          -1
        ],
        "page": 1,
        "page_size": 100,
      }


      const result = await this.post(body, this.prefix, options)
      
      
      if (result && result.status === true) {
        const mappedData = Array.isArray(result.data) 
          ? result.data.map((article: ArticleData) => this.mapArticleData(article)) 
          : [];
          
        return { error: false, data: mappedData }
      }
      
      console.error("API request failed:", result);
      return { error: true, data: null }
    } catch (error) {
      console.error("Error fetching articles:", error)
      return { error: true, data: null }
    }
  }

  // should by SLUG
  async getArticleById(id: string) {
    try {
      
      const options = {
        headers: {
          "X-Api-Token": config.MACHINA_API_KEY,
          "Content-Type": "application/json",
        }
      }

      const body = {
        "filters": {
          "_id": id
        },
        "page": 1,
        "page_size": 1
      }

      const result = await this.post(body, this.prefix, options)
      
      if (result && result.status === true && result.data && result.data.length > 0) {
        const mappedData = this.mapArticleData(result.data[0])
        return { error: false, data: mappedData }
      }
      
      console.error(`Article ${id} not found in API response:`, result);
      return { error: true, data: null }
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error)
      return { error: true, data: null }
    }
  }
}

export default new ArticlesService() 
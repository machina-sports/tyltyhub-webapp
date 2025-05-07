import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import articlesService from '@/libs/client/articles.service'

export interface ArticleValue {
  title?: string
  subtitle?: string
  slug?: string
  status?: string
  "section_1_title"?: string
  "section_1_content"?: string
  "section_2_title"?: string
  "section_2_content"?: string
  "section_3_title"?: string
  "section_3_content"?: string
  "section_4_title"?: string
  "section_4_content"?: string
  "section_5_title"?: string
  "section_5_content"?: string
  "event-details"?: {
    match?: string
    venue?: string
    when?: string
  }
  "widget-match-embed"?: string
  execution?: string
  [key: string]: any
}

export interface ArticleMetadata {
  competition?: string
  document_type?: string
  event_code?: string
  event_type?: string
  language?: string
  [key: string]: any
}

export interface Article {
  _id?: string
  id?: string
  created?: string
  date?: string | Date
  updated?: string
  metadata?: ArticleMetadata
  name?: string
  status?: string | null
  value?: ArticleValue
  readTime?: string  // Will be calculated based on content length
  views?: number      // For tracking article views
  [key: string]: any
}

export interface ArticlesState {
  articles: Article[]
  currentArticle: Article | null
  loading: boolean
  error: string | null
  relatedArticles?: Article[] // For storing related articles
  page: number
  hasMore: boolean
  totalDocuments: number
}

const initialState: ArticlesState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
  relatedArticles: [],
  page: 1,
  hasMore: true,
  totalDocuments: 0
}

export interface FetchArticlesParams {
  page?: number
  pageSize?: number
  append?: boolean
  language?: string
  filters?: Record<string, any>
}

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params: FetchArticlesParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, pageSize = 10, language = 'br', filters = {} } = params
      
      const response = await articlesService.getArticles({
        page,
        pageSize,
        language,
        filters
      })
      
      if (response.error) {
        console.error('Error fetching articles:', response);
        return rejectWithValue('Failed to fetch articles')
      }
      
      const articlesData = Array.isArray(response.data) ? response.data : [];
      return {
        articles: articlesData,
        page,
        append: params.append || false,
        totalDocuments: response.total_documents || 0
      };
    } catch (error) {
      console.error('Error in fetchArticles thunk:', error);
      return rejectWithValue('An error occurred while fetching articles')
    }
  }
)

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await articlesService.getArticleById(id)
      
      if (response.error || !response.data) {
        console.error('Error fetching article by ID:', response);
        return rejectWithValue(`Failed to fetch article with id ${id}`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error in fetchArticleById thunk for ID ${id}:`, error);
      return rejectWithValue(`An error occurred while fetching article with id ${id}`)
    }
  }
)

// New thunk for fetching related articles
export const fetchRelatedArticles = createAsyncThunk(
  'articles/fetchRelatedArticles',
  async (params: { eventType?: string, competition?: string, language?: string }, { rejectWithValue }) => {
    try {
      const filters: Record<string, any> = {};
      
      if (params.eventType) {
        filters['metadata.event_type'] = params.eventType;
      }
      
      if (params.competition) {
        filters['metadata.competition'] = params.competition;
      }
      
      // Call getArticles with our params
      const response = await articlesService.getArticles({
        page: 1,
        pageSize: 3,
        language: params.language || 'br',
        filters
      })
      
      if (response.error) {
        console.error('Error fetching related articles:', response);
        return rejectWithValue('Failed to fetch related articles')
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error in fetchRelatedArticles thunk:', error);
      return rejectWithValue('An error occurred while fetching related articles')
    }
  }
)

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      // Increment views for a specific article
      const articleId = action.payload;
      if (state.currentArticle && state.currentArticle._id === articleId) {
        state.currentArticle.views = (state.currentArticle.views || 0) + 1;
      }
    },
    resetArticles: (state) => {
      state.articles = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<{
        articles: Article[],
        page: number,
        append: boolean,
        totalDocuments: number
      }>) => {
        state.loading = false
        
        // If append is true, add to existing articles, otherwise replace
        if (action.payload.append) {
          state.articles = [...state.articles, ...action.payload.articles]
        } else {
          state.articles = action.payload.articles
        }
        
        state.page = action.payload.page
        state.totalDocuments = action.payload.totalDocuments
        state.hasMore = state.articles.length < state.totalDocuments
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Don't clear articles on error to maintain previous state
      })
      // Handle fetchArticleById
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false
        state.currentArticle = action.payload
        
        // Calculate read time based on content length if not provided
        if (state.currentArticle && !state.currentArticle.readTime) {
          const content = [
            state.currentArticle.value?.section_1_content,
            state.currentArticle.value?.section_2_content,
            state.currentArticle.value?.section_3_content,
            state.currentArticle.value?.section_4_content,
            state.currentArticle.value?.section_5_content,
          ].filter(Boolean).join(' ');
          
          // Average reading speed: 200 words per minute
          const wordCount = content.split(/\s+/).length;
          const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
          state.currentArticle.readTime = `${readTimeMinutes} min`;
        }
        
        // Initialize views if not set
        if (state.currentArticle && !state.currentArticle.views) {
          state.currentArticle.views = 0;
        }
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.currentArticle = null
      })
      // Handle fetchRelatedArticles
      .addCase(fetchRelatedArticles.pending, (state) => {
        // Don't set loading true here to avoid UI issues with the main article
      })
      .addCase(fetchRelatedArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.relatedArticles = action.payload
      })
      .addCase(fetchRelatedArticles.rejected, (state) => {
        state.relatedArticles = []
      })
  }
})

export const { clearCurrentArticle, incrementViews, resetArticles } = articlesSlice.actions
export default articlesSlice.reducer 
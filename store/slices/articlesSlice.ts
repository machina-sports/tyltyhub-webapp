import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import articlesService from '@/libs/client/articles.service'

export interface Article {
  _id?: string
  id?: string
  title?: string
  description?: string
  image?: string
  image_url?: string
  content?: string
  createdAt?: string
  updatedAt?: string
  author?: string
  category?: string
  date?: string | Date
  readTime?: string
  [key: string]: any
}

interface ArticlesState {
  articles: Article[]
  currentArticle: Article | null
  loading: boolean
  error: string | null
}

const initialState: ArticlesState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null
}

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articlesService.getArticles()
      
      if (response.error) {
        console.error('Error fetching articles:', response);
        return rejectWithValue('Failed to fetch articles')
      }
      
      const articlesData = Array.isArray(response.data) ? response.data : [];
      return articlesData;
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

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.loading = false
        state.articles = action.payload || []
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.articles = []
      })
      // Handle fetchArticleById
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false
        state.currentArticle = action.payload
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.currentArticle = null
      })
  }
})

export const { clearCurrentArticle } = articlesSlice.actions
export default articlesSlice.reducer 
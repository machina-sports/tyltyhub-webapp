import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import * as actions from "@/providers/article/actions"
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
  readTime?: string
  views?: number
  [key: string]: any
}

interface ArticleState {
  currentArticle: Article | null
  relatedArticles: Article[]
  loading: boolean
  error: string | null
}

const initialState: ArticleState = {
  currentArticle: null,
  relatedArticles: [],
  loading: false,
  error: null
}

const ArticleReducer = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearArticle: (state) => {
      state.currentArticle = null
      state.relatedArticles = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchArticle
      .addCase(actions.doFetchArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(actions.doFetchArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false
        state.currentArticle = action.payload

        // Calculate read time if not provided
        if (state.currentArticle && !state.currentArticle.readTime) {
          const content = [
            state.currentArticle.value?.section_1_content,
            state.currentArticle.value?.section_2_content,
            state.currentArticle.value?.section_3_content,
            state.currentArticle.value?.section_4_content,
            state.currentArticle.value?.section_5_content,
          ].filter(Boolean).join(' ')

          const wordCount = content.split(/\s+/).length
          const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
          state.currentArticle.readTime = `${readTimeMinutes} min`
        }

        // Initialize views if not set
        if (state.currentArticle && !state.currentArticle.views) {
          state.currentArticle.views = 0
        }
      })
      .addCase(actions.doFetchArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.currentArticle = null
      })

      // Handle fetchRelatedArticles
      .addCase(actions.doFetchRelatedArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.relatedArticles = action.payload
      })
      .addCase(actions.doFetchRelatedArticles.rejected, (state) => {
        state.relatedArticles = []
      })
  }
})

export const { clearArticle } = ArticleReducer.actions

export default ArticleReducer

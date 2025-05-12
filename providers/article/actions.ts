import { createAsyncThunk } from "@reduxjs/toolkit"

import ArticleService from "@/providers/article/service"

export const fetchArticle = async (id: string, thunkAPI: any) => {
  try {
    const response = await ArticleService.getArticle(id)
    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error?.error || error?.message || error })
  }
}

export const fetchRelatedArticles = async (params: { eventType?: string, competition?: string, language?: string }, thunkAPI: any) => {
  try {
    const response = await ArticleService.getRelatedArticles(params)
    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error?.error || error?.message || error })
  }
}

export const doFetchArticle = createAsyncThunk('article/fetchArticle', fetchArticle)
export const doFetchRelatedArticles = createAsyncThunk('article/fetchRelatedArticles', fetchRelatedArticles)
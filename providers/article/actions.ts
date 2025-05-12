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

export const fetchArticles = async (
  params: { page: number; pageSize: number; language: string; filters?: any; search?: string },
  thunkAPI: any
) => {
  try {
    const response = await ArticleService.searchArticles({
      page: params.page,
      pageSize: params.pageSize,
      language: params.language,
      filters: params.filters || {},
      search: params.search || ""
    });
    if (response.error) {
      return thunkAPI.rejectWithValue("Error fetching articles");
    }
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
};

export const doFetchArticle = createAsyncThunk('article/fetchArticle', fetchArticle)
export const doFetchRelatedArticles = createAsyncThunk('article/fetchRelatedArticles', fetchRelatedArticles)
export const doSearchArticles = createAsyncThunk("article/searchArticles", fetchArticles)
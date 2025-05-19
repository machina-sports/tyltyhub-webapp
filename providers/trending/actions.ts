import { createAsyncThunk } from "@reduxjs/toolkit"

import TrendingService from "@/providers/trending/service"

export const getTrendingArticles = createAsyncThunk(
  'trending/getTrendingArticles',
  async (_, thunkAPI) => {
    try {
      const response = await TrendingService.getTrendingArticles()
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.error })
    }
  }
)

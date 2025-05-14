import { createAsyncThunk } from "@reduxjs/toolkit"

import DataService from "@/providers/discover/service"

interface SearchFilters {
  name: string;
  "metadata.language": string;
  team?: string;
  $or?: Array<{
    [key: string]: { $regex: string; $options: string; };
  }>;
}

interface SearchParams {
  filters: SearchFilters;
  pagination: {
    page: number;
    page_size: number;
  };
  sorters: [string, number];
}

export const searchArticles = createAsyncThunk(
  'discover/searchArticles',
  async (params: SearchParams, thunkAPI) => {
    try {
      const response = await DataService.searchArticles(params)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.error })
    }
  }
)

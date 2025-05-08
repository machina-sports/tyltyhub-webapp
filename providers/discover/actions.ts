import { createAsyncThunk } from "@reduxjs/toolkit"

import DataService from "@/providers/discover/service"

export const searchArticles = async ({ filters, pagination, sorters }: { filters: any, pagination: any, sorters: any }, thunkAPI: any) => {
  try {
    const response = await DataService.searchArticles({ filters, pagination, sorters })
    return response
  } catch (response: any) {
    return thunkAPI.rejectWithValue({ error: response.error })
  }
}

export const doSearchArticles = createAsyncThunk("DISCOVER/SEARCH_ARTICLES", searchArticles)

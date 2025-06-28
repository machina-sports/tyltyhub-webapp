import { createSlice } from "@reduxjs/toolkit"
import { getTrendingArticles } from "./actions"

interface Article {
  _id?: string;
  id?: string;
  created?: string;
  date?: string | Date;
  updated?: string;
  metadata?: {
    language?: string;
    [key: string]: any;
  };
  name?: string;
  status?: string | null;
  value?: {
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
  readTime?: string;
  views?: number;
  [key: string]: any;
}

interface TrendingState {
  trendingResults: {
    data: Article[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      hasMore: boolean;
    };
    status: string;
    error: string | null;
  }
}

const initialState: TrendingState = {
  trendingResults: {
    data: [],
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      hasMore: false
    },
    status: "loading",
    error: null
  }
}

const TrendingReducer = createSlice({
  name: 'trending',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingArticles.pending, (state) => {
        state.trendingResults.status = "loading";
        state.trendingResults.error = null;
      })
      .addCase(getTrendingArticles.fulfilled, (state, action) => {
        state.trendingResults.data = action.payload.data || [];
        state.trendingResults.pagination.total = action.payload.total_documents || 0;
        state.trendingResults.pagination.page = action.payload.page || 1;
        state.trendingResults.pagination.hasMore = action.payload.total_documents > state.trendingResults.pagination.page * state.trendingResults.pagination.page_size;
      })
      .addCase(getTrendingArticles.rejected, (state, action) => {
        state.trendingResults.status = "failed";
        state.trendingResults.error = action.payload as string;
      });
  }
});

export default TrendingReducer;

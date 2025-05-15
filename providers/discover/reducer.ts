import { createSlice } from "@reduxjs/toolkit"
import { searchArticles } from "./actions"

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

interface DiscoverState {
  searchResults: {
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

const initialState: DiscoverState = {
  searchResults: {
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

const DiscoverReducer = createSlice({
  name: 'discover',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchArticles.pending, (state) => {
        state.searchResults.status = "loading";
        state.searchResults.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        const meta = action.meta || {};
        const arg = meta.arg || {};
        const page = arg.pagination?.page || 1;
        const pageSize = arg.pagination?.page_size || state.searchResults.pagination.page_size;

        if (page === 1) {
          state.searchResults.data = action.payload.data || [];
        } else {
          state.searchResults.data = [
            ...state.searchResults.data,
            ...(action.payload.data || [])
          ];
        }

        state.searchResults.pagination.total = action.payload.total_documents || 0;
        state.searchResults.pagination.page = page;
        state.searchResults.pagination.hasMore = action.payload.total_documents > page * pageSize;
        state.searchResults.status = "idle";
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.searchResults.status = "failed";
        state.searchResults.error = action.payload as string;
      });
  }
});

export default DiscoverReducer;

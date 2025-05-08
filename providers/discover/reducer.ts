import { createSlice } from "@reduxjs/toolkit"

import * as actions from "@/providers/discover/actions"

export interface InitialStateProps {
  articles: {
    data: []
    filters: any,
    pagination: {
      page: number,
      page_size: number,
      total: number,
      hasMore: boolean
    },
    sorters: {
      field: string,
      order: number
    },
    status: "idle" | "loading" | "failed"
  }
}

const initialState: InitialStateProps = {
  articles: {
    data: [],
    filters: {
      "name": {
        "$in": ["content-article"],
      },
      "metadata.language": "br"
    },
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      hasMore: true
    },
    sorters: {
      field: "_id",
      order: -1
    },
    status: "idle"
  }
}

const DiscoverReducer = createSlice({
  name: "discover",
  initialState: initialState,
  reducers: {
    setFilters: (state, action) => {
      state.articles.filters = action.payload
    },
    setPagination: (state, action) => {
      state.articles.pagination = action.payload
    },
    setSorters: (state, action) => {
      state.articles.sorters = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // User Profile
      .addCase(actions.doSearchArticles.pending, (state) => {
        state.articles.status = "loading"
      })
      .addCase(actions.doSearchArticles.fulfilled, (state: any, action) => {
        state.articles.data = [
          ...state.articles.data,
          ...action.payload?.data || []
        ]
        state.articles.pagination.total = action.payload?.total_documents || 0
        state.articles.pagination.hasMore = action.payload?.total_documents > state.articles.pagination.page * state.articles.pagination.page_size
        state.articles.status = "idle"
      })
      .addCase(actions.doSearchArticles.rejected, (state) => {
        state.articles.status = "failed"
      })
  },
})

export const { setFilters, setPagination, setSorters } = DiscoverReducer.actions

export default DiscoverReducer

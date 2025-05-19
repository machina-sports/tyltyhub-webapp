import {
  Action,
  configureStore,
  ThunkAction
} from "@reduxjs/toolkit"

import DiscoverReducer from "@/providers/discover/reducer"
import ArticleReducer from "@/providers/article/reducer"
import StandingsReducer from "@/providers/standings/reducer"
import ThreadsReducer from "@/providers/threads/reducer"
import TrendingReducer from "@/providers/trending/reducer"

export function makeStore() {
  return configureStore({
    reducer: {
      article: ArticleReducer.reducer,
      discover: DiscoverReducer.reducer,
      standings: StandingsReducer.reducer,
      threads: ThreadsReducer.reducer,
      trending: TrendingReducer.reducer,
    },
    middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat()
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store

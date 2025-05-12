import {
  Action,
  configureStore,
  ThunkAction
} from "@reduxjs/toolkit"

import DiscoverReducer from "@/providers/discover/reducer"

import ThreadsReducer from "@/providers/threads/reducer"

export function makeStore() {
  return configureStore({
    reducer: {
      discover: DiscoverReducer.reducer,
      threads: ThreadsReducer.reducer,
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

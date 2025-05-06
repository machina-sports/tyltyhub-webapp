"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import { useAppDispatch } from "@/store/dispatch"
import { fetchArticles, resetArticles } from "@/store/slices/articlesSlice"
import { useGlobalState } from "@/store/useState"

const DataProviderContent = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { articles } = useGlobalState()
  
  useEffect(() => {
    // Reset articles state and fetch first page
    dispatch(resetArticles())
    dispatch(fetchArticles({ 
      page: 1, 
      pageSize: 6,
      language: 'br'
    }))
  }, [dispatch])
  
  return <>{children}</>
}

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <Provider store={store}>
      <DataProviderContent>{children}</DataProviderContent>
    </Provider>
  )
}

export default DataProvider
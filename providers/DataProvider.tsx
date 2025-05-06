"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import { useAppDispatch } from "@/store/dispatch"
import { fetchArticles } from "@/store/slices/articlesSlice"
import { useGlobalState } from "@/store/useState"

const DataProviderContent = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { articles } = useGlobalState()
  
  useEffect(() => {
    dispatch(fetchArticles())
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
"use client"

import { createContext, ReactNode, useContext } from "react"

interface ArticleContextType {
  articleId: string
  title: string
  url?: string
  shareImageUrl?: string
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined)

interface ArticleContextProviderProps {
  children: ReactNode
  articleId: string
  title: string
  url?: string
  shareImageUrl?: string
}

export function ArticleContextProvider({ 
  children, 
  articleId, 
  title, 
  url, 
  shareImageUrl 
}: ArticleContextProviderProps) {
  return (
    <ArticleContext.Provider value={{ articleId, title, url, shareImageUrl }}>
      {children}
    </ArticleContext.Provider>
  )
}

export function useArticleContext() {
  const context = useContext(ArticleContext)
  if (context === undefined) {
    throw new Error('useArticleContext must be used within an ArticleContextProvider')
  }
  return context
}

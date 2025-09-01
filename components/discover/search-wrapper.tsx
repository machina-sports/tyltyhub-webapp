"use client"

import { createContext, ReactNode, useContext } from "react"

interface SearchWrapperContextType {
  clearSearchQuery: () => void
}

const SearchWrapperContext = createContext<SearchWrapperContextType | undefined>(undefined)

interface SearchWrapperProps {
  children: ReactNode
  onClearSearch: () => void
}

export function SearchWrapper({ children, onClearSearch }: SearchWrapperProps) {
  return (
    <SearchWrapperContext.Provider value={{ clearSearchQuery: onClearSearch }}>
      {children}
    </SearchWrapperContext.Provider>
  )
}

export function useSearchWrapper() {
  const context = useContext(SearchWrapperContext)
  if (context === undefined) {
    throw new Error('useSearchWrapper must be used within a SearchWrapper')
  }
  return context
}

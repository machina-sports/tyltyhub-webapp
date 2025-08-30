"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface SearchContextType {
  isSearchVisible: boolean
  toggleSearch: () => void
  hideSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
  }

  const hideSearch = () => {
    setIsSearchVisible(false)
  }

  return (
    <SearchContext.Provider value={{ isSearchVisible, toggleSearch, hideSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

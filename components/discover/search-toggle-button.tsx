"use client"

import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useSearch } from "./search-context"

interface SearchToggleButtonProps {
  onClearSearch?: () => void
}

export function SearchToggleButton({ onClearSearch }: SearchToggleButtonProps) {
  const { isSearchVisible, toggleSearch, hideSearch } = useSearch()

  const handleClick = () => {
    if (isSearchVisible) {
      // Se está visível, esconder e limpar o campo
      hideSearch()
      if (onClearSearch) {
        onClearSearch()
      }
    } else {
      // Se não está visível, mostrar
      toggleSearch()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12 p-2 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10"
      onClick={handleClick}
      aria-label={isSearchVisible ? "Cerrar búsqueda" : "Abrir búsqueda"}
    >
      {isSearchVisible ? (
        <X className="h-5 w-5" />
      ) : (
        <Search className="h-5 w-5" />
      )}
    </Button>
  )
}

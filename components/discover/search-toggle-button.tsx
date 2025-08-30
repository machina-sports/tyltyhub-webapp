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
      className="h-10 w-10 text-bwin-brand-primary hover:text-bwin-neutral-100 hover:bg-bwin-brand-primary/10"
      onClick={handleClick}
      aria-label={isSearchVisible ? "Cerrar búsqueda" : "Abrir búsqueda"}
    >
      {isSearchVisible ? (
        <X className="h-4 w-4" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
  )
}

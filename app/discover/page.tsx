"use client";
import { ArticleGrid } from "@/components/discover/article-grid";
import { useSearch } from "@/components/discover/search-context";
import { SearchWrapper } from "@/components/discover/search-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { searchArticles } from "@/providers/discover/actions";
import { useAppDispatch } from "@/store/dispatch";
import { useGlobalState } from "@/store/useState";
import { Newspaper, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBrandConfig } from "@/contexts/brand-context";

interface SearchFilters {
  name: string;
  "metadata.language": string;
  "metadata.content_type"?: { "$ne": string };
  "value.title"?: { $regex: string; $options: string };
}

interface SearchResults {
  data: any[];
  status: string;
  pagination: {
    page: number;
    hasMore: boolean;
  };
}

interface ArticleSection {
  type: 'fullWidth' | 'threeCards';
  articles: any[];
}

// Custom hook for search debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const buildSearchFilters = (searchQuery: string): SearchFilters => {
  const baseFilters: SearchFilters = {
    name: "content-article",
    "metadata.language": "es",
    "metadata.content_type": { "$ne": "trendings-competition-trendings" }
  };

  if (searchQuery) {
    baseFilters["value.title"] = { $regex: searchQuery, $options: "i" };
  }

  return baseFilters;
};

export default function DiscoverPage() {
  const brand = useBrandConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { isSearchVisible } = useSearch();
  const headerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const searchResults = useGlobalState((state: any) => state.discover.searchResults) as SearchResults;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const pageSize = 8; // Carregando em múltiplos de 4

  const handleScroll = useCallback(() => {
    if (headerRef.current) {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchQuery(newValue);
      
      if (!newValue) {
        setIsSearching(true);
        const filters = buildSearchFilters("");
        dispatch(searchArticles({ 
          filters,
          pagination: { page: 1, page_size: pageSize },
          sorters: ["_id", -1]
        })).finally(() => setIsSearching(false));
      }
    },
    [dispatch, pageSize]
  );

  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        setIsSearching(true);
        const filters = buildSearchFilters(searchQuery);
        dispatch(searchArticles({ 
          filters,
          pagination: { page: 1, page_size: pageSize },
          sorters: ["_id", -1]
        })).finally(() => setIsSearching(false));
      }
    },
    [searchQuery, dispatch, pageSize]
  );

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'tab_change', {
        event_category: 'discover_page',
        event_label: `Changed to ${value} tab`,
        value: value,
      });
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    // Recarregar artigos sem filtro de busca
    setIsSearching(true);
    const filters = buildSearchFilters("");
    dispatch(searchArticles({ 
      filters,
      pagination: { page: 1, page_size: pageSize },
      sorters: ["_id", -1]
    })).finally(() => setIsSearching(false));
  }, [dispatch, pageSize]);

  const handleLoadMore = useCallback(() => {
    if (searchResults.status !== "loading" && searchResults.pagination.hasMore) {
      const nextPage = searchResults.pagination.page + 1;
      const filters = buildSearchFilters(debouncedSearchQuery);

      dispatch(searchArticles({ 
        filters,
        pagination: { page: nextPage, page_size: pageSize },
        sorters: ["_id", -1]
      }));
    }
  }, [searchResults.status, searchResults.pagination.hasMore, searchResults.pagination.page, debouncedSearchQuery, dispatch, pageSize]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const filters = buildSearchFilters("");
    dispatch(searchArticles({ 
      filters,
      pagination: { page: 1, page_size: pageSize },
      sorters: ["_id", -1]
    }));
  }, [dispatch, pageSize]);



  const displayedArticles = searchResults.data;

  const articleSections = useMemo(() => {
    if (!displayedArticles.length) return [];
    const result: ArticleSection[] = [];
    let i = 0;

    while (i < displayedArticles.length) {
      if (i < displayedArticles.length) {
        result.push({
          type: 'fullWidth',
          articles: [displayedArticles[i]]
        });
        i++;
      }

      const threeCardChunk = displayedArticles.slice(i, i + 3);
      if (threeCardChunk.length) {
        result.push({
          type: 'threeCards',
          articles: threeCardChunk
        });
        i += threeCardChunk.length;
      }
    }

    return result;
  }, [displayedArticles]);

  return (
    <SearchWrapper onClearSearch={handleClearSearch}>
      <div className="mobile-container pt-4 max-w-5xl mx-auto">
      <h1 className="sr-only">{brand.description}</h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full relative"
      >
        <div
          ref={headerRef}
          style={{
          }}
        >
          <div className="border-b pb-4 border-bwin-neutral-30">
            <TabsList className="w-full justify-start overflow-x-auto" style={{
              backgroundColor: 'hsl(var(--bg-secondary))',
              borderColor: 'hsl(var(--border-primary))'
            }}>
              <TabsTrigger 
                value="news" 
                className="flex items-center gap-2 text-white data-[state=active]:text-white"
                style={{
                  backgroundColor: 'transparent'
                }}
              >
                <Newspaper className="h-4 w-4" />
                {brand.content.navigation?.discover || "Notícias"}
              </TabsTrigger>
            </TabsList>
          </div>

          {activeTab === "news" && (
            <div className={cn(
              "py-4 px-0 sm:px-0 transition-all duration-300",
              // No mobile: mostrar apenas se isSearchVisible for true
              // No desktop: sempre mostrar
              "md:block",
              isSearchVisible ? "block" : "hidden md:block"
            )}>
              <div className="flex justify-end items-center">
                <div className="relative w-full md:w-[232px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-bwin-neutral-80" />
                  <Input
                    placeholder="Buscar artigos..."
                    className="pl-8 text-base max-w-[232px] text-white placeholder:text-neutral-60 focus:border-brand-primary"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      backgroundColor: 'hsl(var(--bg-secondary))',
                      borderColor: 'hsl(var(--border-primary))',
                      fontSize: '16px'
                    }}
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loading width={20} height={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="news" className="pt-0 md:pt-0">
          <div className="space-y-12">
            {searchResults.status === "loading" && !searchResults.data.length ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loading width={100} height={100} showLabel={true} label="Carregando artigos..." />
              </div>
            ) : articleSections && articleSections.length > 0 ? (
              <>
                {articleSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    {section.type === "fullWidth" ? (
                      <ArticleGrid
                        articles={section.articles}
                        layout="fullWidth"
                      />
                    ) : (
                      <ArticleGrid
                        articles={section.articles}
                        layout="threeCards"
                      />
                    )}
                  </div>
                ))}
                {/* Load more button */}
                <div className="py-8 flex justify-center">
                  {searchResults.status === "loading" &&
                    !isSearching &&
                    searchResults.data.length > 0 ? (
                      <Loading width={100} height={100} showLabel={true} label="Carregando mais artigos..." />
                    ) : searchResults.pagination.hasMore && searchResults.data.length > 0 ? (
                      <div className="flex flex-col items-center gap-3">
                        <Button
                          onClick={handleLoadMore}
                          className="rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-all duration-200 load-more-button"
                          style={{ 
                            backgroundColor: 'hsl(var(--brand-primary))',
                            color: 'white'
                          }}
                          disabled={searchResults.status === "loading"}
                        >
                          <Plus className="h-8 w-8" />
                        </Button>
                        <span className="text-sm text-bwin-neutral-60 font-medium">Carregar mais artigos</span>
                      </div>
                    ) : searchResults.data.length > 0 ? (
                      <p className="text-sm text-bwin-neutral-60 py-2">
                        Não há mais artigos para carregar
                      </p>
                    ) : null}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-bwin-neutral-60">
                {searchResults.status === "loading"
                  ? "Carregando artigos..."
                  : "Nenhum artigo encontrado"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </SearchWrapper>
  );
}


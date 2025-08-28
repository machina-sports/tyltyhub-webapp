"use client";
import { ArticleGrid } from "@/components/discover/article-grid";
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { searchArticles } from "@/providers/discover/actions";
import { useAppDispatch } from "@/store/dispatch";
import { useGlobalState } from "@/store/useState";
import { Newspaper, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const searchResults = useGlobalState((state: any) => state.discover.searchResults) as SearchResults;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const pageSize = 6;

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && searchResults.status !== "loading" && searchResults.pagination.hasMore) {
          const nextPage = searchResults.pagination.page + 1;
          const filters = buildSearchFilters(debouncedSearchQuery);

          dispatch(searchArticles({ 
            filters,
            pagination: { page: nextPage, page_size: pageSize },
            sorters: ["_id", -1]
          }));
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    searchResults.status,
    searchResults.pagination,
    dispatch,
    debouncedSearchQuery,
    pageSize
  ]);

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
    <div className="mobile-container pb-24 md:pb-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="sr-only">La Inteligencia Artificial de bwin</h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full relative"
      >
        <div
          ref={headerRef}
          className={cn(
            "md:sticky z-20 transition-shadow duration-200",
            isScrolled ? "shadow-md shadow-black/5" : "shadow-none",
            "top-[64px] md:top-0",
            "bg-bwin-neutral-10",
            "pt-24 md:pt-8 pb-4"
          )}
        >
          <div className="border-b pb-4 border-bwin-neutral-30">
            <TabsList className="w-full justify-start overflow-x-auto bg-bwin-neutral-20 border-bwin-neutral-30">
              <TabsTrigger 
                value="news" 
                className="flex items-center gap-2 text-bwin-neutral-100 data-[state=active]:bg-bwin-brand-primary data-[state=active]:text-bwin-neutral-0"
              >
                <Newspaper className="h-4 w-4" />
                Noticias
              </TabsTrigger>
              {/* Removido o botão de Estatísticas */}
            </TabsList>
          </div>

          {activeTab === "news" && (
            <div className="py-4 px-0 sm:px-0 bg-bwin-neutral-10">
              <div className="flex justify-end items-center">
                <div className="relative w-full md:w-[232px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-bwin-neutral-80" />
                  <Input
                    placeholder="Buscar artículos..."
                    className="pl-8 text-base max-w-[232px] bg-bwin-neutral-20 border-bwin-neutral-30 text-bwin-neutral-100 placeholder:text-bwin-neutral-60 focus:border-bwin-brand-primary"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    style={{ fontSize: '16px' }}
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
                <Loading width={100} height={100} />
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
                {/* Load more indicator */}
                <div ref={loadMoreRef} className="py-4 flex justify-center">
                  {searchResults.status === "loading" &&
                    !isSearching &&
                    searchResults.data.length > 0 && (
                      <Loading width={100} height={100} />
                    )}
                  {searchResults.status !== "loading" &&
                    !searchResults.pagination.hasMore &&
                    searchResults.data.length > 0 && (
                      <p className="text-sm text-bwin-neutral-60 py-2">
                        No hay más artículos para cargar
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-bwin-neutral-60">
                {searchResults.status === "loading"
                  ? "Cargando artículos..."
                  : "No se encontraron artículos"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Removido o TabsContent de teams */}
      </Tabs>
      
      {/* Responsible Gaming Footer */}
      <ResponsibleGamingResponsive />
    </div>
  );
}


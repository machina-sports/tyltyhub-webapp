"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Newspaper, Table2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamFilter } from "@/components/discover/sport-filter";
import { ArticleGrid } from "@/components/discover/article-grid";
import { ArticleSkeleton } from "@/components/discover/article-skeleton";
import { FifaCwcSchedule } from "@/components/discover/fifa-cwc-schedule";
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import { Input } from "@/components/ui/input";
import teamsData from "@/data/teams.json";
import { searchArticles } from "@/providers/discover/actions";
import { Loading } from "@/components/ui/loading";

interface Team {
  id: string;
  name: string;
  logo: string;
  league: string;
}

interface SearchFilters extends Record<string, any> {
  name: string;
  "metadata.language": string;
  team?: string;
  "value.title"?: { 
    $regex: string; 
    $options: string; 
  };
}

interface SearchResults {
  data: Article[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    hasMore: boolean;
  };
  status: "idle" | "loading" | "failed";
  error: string | null;
}

interface Article {
  _id?: string;
  id?: string;
  value?: {
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
  metadata?: {
    language?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ArticleSection {
  type: 'fullWidth' | 'threeCards';
  articles: Article[];
}

const buildSearchFilters = (
  selectedTeam: string,
  teams: Team[],
  searchQuery: string
): SearchFilters => {
  const baseFilters: SearchFilters = {
    name: "content-article",
    "metadata.language": "br",
    "metadata.content_type": { "$ne": "trendings-competition-trendings" }
  };
  
  if (selectedTeam !== "all-teams") {
    const teamName = teams.find((t: Team) => t.id === selectedTeam)?.name;
    if (teamName) {
      return { ...baseFilters, team: teamName };
    }
  }

  if (searchQuery) {
    return {
      ...baseFilters,
      "value.title": { $regex: searchQuery, $options: "i" }
    };
  }

  return baseFilters;
};

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

export default function DiscoverPage() {
  const [selectedTeam, setSelectedTeam] = useState("all-teams");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const searchResults = useGlobalState((state: any) => state.discover.searchResults) as SearchResults;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const teams = useMemo(() => teamsData.teams || [], []);
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
        const filters = buildSearchFilters(selectedTeam, teams, "");
        dispatch(searchArticles({ 
          filters,
          pagination: { page: 1, page_size: pageSize },
          sorters: ["_id", -1]
        })).finally(() => setIsSearching(false));
      }
    },
    [selectedTeam, teams, dispatch, pageSize]
  );

  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        setIsSearching(true);
        const filters = buildSearchFilters(selectedTeam, teams, searchQuery);
        dispatch(searchArticles({ 
          filters,
          pagination: { page: 1, page_size: pageSize },
          sorters: ["_id", -1]
        })).finally(() => setIsSearching(false));
      }
    },
    [searchQuery, selectedTeam, teams, dispatch, pageSize]
  );

  const handleTeamChange = useCallback((value: string) => {
    setSelectedTeam(value);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const filters = buildSearchFilters(selectedTeam, teams, "");
    dispatch(searchArticles({ 
      filters,
      pagination: { page: 1, page_size: pageSize },
      sorters: ["_id", -1]
    }));
  }, [selectedTeam, dispatch, teams, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && searchResults.status !== "loading" && searchResults.pagination.hasMore) {
          const nextPage = searchResults.pagination.page + 1;
          const filters = buildSearchFilters(selectedTeam, teams, debouncedSearchQuery);

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
    selectedTeam,
    teams,
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
    <div className="mobile-container pb-4 space-y-6 max-w-5xl mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full relative"
      >
        <div
          ref={headerRef}
          className={`sticky z-20 bg-background transition-shadow duration-200 ${
            isScrolled ? "shadow-md shadow-black/5" : "shadow-none"
          } top-[64px] md:top-0`}
          style={{ position: "sticky" }}
        >
          <div className="border-b pb-2 pt-2">
            <TabsList className="bg-background w-full justify-start overflow-x-auto">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Notícias
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
            </TabsList>
          </div>

          {activeTab === "news" && (
            <div className="py-2 px-4 sm:px-0 bg-background">
              <div className="flex justify-between items-center gap-4">
                <TeamFilter value={selectedTeam} onChange={handleTeamChange} />
                <div className="relative w-full md:w-[232px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar artigos..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
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

        <div className="h-8 md:h-4"></div>

        <TabsContent value="news" className="space-y-6 pt-6 md:pt-4">
          <div className="space-y-8">
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
                      <p className="text-sm text-muted-foreground py-2">
                        Não há mais artigos para carregar
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {searchResults.status === "loading"
                  ? "Carregando artigos..."
                  : "Nenhum artigo encontrado"}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="pt-4">
          <div className="pt-2">
            <FifaCwcSchedule />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


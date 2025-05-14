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

interface Team {
  id: string;
  name: string;
  logo: string;
  league: string;
}

interface SearchFilters extends Record<string, any> {
  name: string;
  "metadata.language": string;
}

// Utility function to build search filters
const buildSearchFilters = (
  selectedTeam: string,
  teams: Team[],
  searchQuery: string
): SearchFilters => {
  let filters: SearchFilters = {
    name: "content-article",
    "metadata.language": "br"
  };
  
  if (selectedTeam !== "all-teams") {
    const teamName = teams.find((t: Team) => t.id === selectedTeam)?.name || "";
    if (teamName) {
      filters = { ...filters, team: teamName };
    }
  }

  if (searchQuery) {
    filters = {
      ...filters,
      $or: [
        { "value.title": { $regex: searchQuery, $options: "i" } },
        { "value.subtitle": { $regex: searchQuery, $options: "i" } },
        { "value.section_1_content": { $regex: searchQuery, $options: "i" } },
        { "value.section_2_content": { $regex: searchQuery, $options: "i" } }
      ]
    };
  }

  return filters;
};

// Custom hook for debounced value
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
  const headerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const pageSize = 6;

  const searchResults = useGlobalState((state: any) => state.discover.searchResults);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const teams = useMemo(() => teamsData.teams || [], []);

  const handleScroll = useCallback(() => {
    if (headerRef.current) {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const filters = buildSearchFilters(selectedTeam, teams, debouncedSearchQuery);
    
    dispatch(searchArticles({ 
      filters,
      pagination: { page: 1, page_size: pageSize },
      sorters: ["_id", -1]
    }));
  }, [debouncedSearchQuery, selectedTeam, dispatch, teams]);

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
  }, [searchResults.status, searchResults.pagination, searchResults.pagination.hasMore, searchResults.pagination.page, dispatch, debouncedSearchQuery, selectedTeam, teams]);

  const displayedArticles = searchResults.data;

  const articleSections = useMemo(() => {
    if (!displayedArticles.length) return [];
    const result = [];
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleTeamChange = useCallback((value: string) => {
    setSelectedTeam(value);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

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
                Tabela
              </TabsTrigger>
            </TabsList>
          </div>

          {activeTab === "news" && (
            <div className="py-2 px-4 sm:px-0 bg-background">
              <div className="flex justify-between items-center gap-4">
                <TeamFilter value={selectedTeam} onChange={handleTeamChange} />
                <div className="relative w-[220px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar"
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 md:h-4"></div>

        <TabsContent value="news" className="space-y-6 pt-6 md:pt-4">
          <div className="space-y-8">
            {searchResults.status === "loading" && !searchResults.data.length ? (
              <>
                <ArticleSkeleton layout="fullWidth" count={1} />
                <ArticleSkeleton layout="threeCards" count={3} />
              </>
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
                    searchResults.data.length > 0 && (
                      <ArticleSkeleton layout="threeCards" count={3} />
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


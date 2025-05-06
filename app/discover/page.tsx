"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Newspaper, Users } from "lucide-react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { TeamFilter } from "@/components/discover/sport-filter"
import { ArticleGrid } from "@/components/discover/article-grid"
import { FifaCwcSchedule } from "@/components/discover/fifa-cwc-schedule"
import { useGlobalState } from "@/store/useState"
import { Article } from "@/store/slices/articlesSlice"
import teamsData from "@/data/teams.json"

interface Team {
  id: string
  name: string
  logo: string
  league: string
}

export default function DiscoverPage() {
  const [selectedTeam, setSelectedTeam] = useState("all-teams")
  const [activeTab, setActiveTab] = useState("news")
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { articles } = useGlobalState()
  
  const teams = useMemo(() => teamsData.teams || [], []);
  
  const handleScroll = useCallback(() => {
    if (headerRef.current) {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const filteredArticles = useMemo(() => {
    if (!articles.articles || articles.articles.length === 0) {
      return [];
    }
    
    if (selectedTeam === "all-teams") {
      return articles.articles;
    }
    
    const team = teams.find((t: Team) => t.id === selectedTeam);
    if (!team) return articles.articles;
    
    return articles.articles.filter((article: Article) => {
      if (!article.value?.title) return false;
      
      const titleIncludes = article.value.title.includes(team.name);
      const subtitleIncludes = article.value?.subtitle ? 
        article.value.subtitle.includes(team.name) : false;
      const eventMatch = article.value?.["event-details"]?.match ?
        article.value["event-details"].match.includes(team.name) : false;
      
      return titleIncludes || subtitleIncludes || eventMatch;
    });
  }, [articles.articles, selectedTeam, teams]);

  const articleSections = useMemo(() => {
    const articles = filteredArticles;
    if (!articles || !articles.length) return [];
    
    const result = [];
    let i = 0;
    
    while (i < articles.length) {
      if (i < articles.length) {
        result.push({
          type: 'fullWidth',
          articles: [articles[i]]
        });
        i++;
      }
      
      const threeCardChunk = articles.slice(i, i + 3);
      if (threeCardChunk.length) {
        result.push({
          type: 'threeCards',
          articles: threeCardChunk
        });
        i += threeCardChunk.length;
      }
    }
    
    return result;
  }, [filteredArticles]);

  const handleTeamChange = useCallback((value: string) => {
    setSelectedTeam(value);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="mobile-container pb-4 space-y-6 max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full relative">
        <div 
          ref={headerRef}
          className={`sticky z-20 bg-background transition-shadow duration-200 ${
            isScrolled ? 'shadow-md shadow-black/5' : 'shadow-none'
          } top-[64px] md:top-0`}
          style={{ position: 'sticky' }}
        >
          <div className="border-b pb-2 pt-2">
            <TabsList className="bg-background w-full justify-start overflow-x-auto">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Notícias
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Times
              </TabsTrigger>
            </TabsList>
          </div>
          
          {activeTab === "news" && (
            <div className="py-2 px-4 sm:px-0 bg-background">
              <div className="flex justify-end">
                <TeamFilter 
                  value={selectedTeam} 
                  onChange={handleTeamChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-8 md:h-4"></div>

        <TabsContent value="news" className="space-y-6 pt-6 md:pt-4">          
          <div className="space-y-8">
            {filteredArticles && filteredArticles.length > 0 ? (
              <>
                {articleSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    {section.type === 'fullWidth' ? (
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
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {articles.loading ? 'Carregando artigos...' : 'Nenhum artigo encontrado'}
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
  )
}
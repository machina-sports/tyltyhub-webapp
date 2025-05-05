"use client"

import { useState, useEffect, useRef } from "react"
import { Newspaper, Users, Search, Table2 } from "lucide-react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { SportFilter, TeamFilter } from "@/components/discover/sport-filter"
import { ArticleGrid } from "@/components/discover/article-grid"
import { FifaCwcSchedule } from "@/components/discover/fifa-cwc-schedule"
import { Input } from "@/components/ui/input"
import discoverData from "@/data/discover.json"
import teamsData from "@/data/teams.json"

// Define Team type to match the interface in TeamsGrid
interface Team {
  id: string
  name: string
  logo: string
  league: string
}

export default function DiscoverPage() {
  const [selectedTeam, setSelectedTeam] = useState("all-teams")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("news")
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Add scroll event listener to show shadow only when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY
        // Set isScrolled to true if scrolled past a threshold (e.g., 10px)
        setIsScrolled(scrollPosition > 10)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Filter articles based on selected team and search query
  const filteredArticles = discoverData.articles.filter(article => {
    // Team filter
    const teamFilter = selectedTeam === "all-teams" || (() => {
      const teamName = teamsData.teams.find((t: Team) => t.id === selectedTeam)?.name || ""
      return article.title.includes(teamName) || 
             article.description.includes(teamName)
    })()

    // Search filter
    const searchFilter = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())

    return teamFilter && searchFilter
  })

  // Function to chunk the articles into sections
  const chunkArticles = (articles: any[]) => {
    if (!articles.length) return [];
    
    const result = [];
    let i = 0;
    
    while (i < articles.length) {
      // Add a full-width article section
      if (i < articles.length) {
        result.push({
          type: 'fullWidth',
          articles: [articles[i]]
        });
        i++;
      }
      
      // Add a three-card section
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
  };

  const articleSections = chunkArticles(filteredArticles);

  return (
    <div className="mobile-container pb-4 space-y-6 max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative">
        {/* Sticky header wrapper with fixed position - accounts for mobile top bar */}
        <div 
          ref={headerRef}
          className={`sticky z-20 bg-background transition-shadow duration-200 ${
            isScrolled ? 'shadow-md shadow-black/5' : 'shadow-none'
          } top-[64px] md:top-0`}
          style={{ position: 'sticky' }}
        >
          {/* Tabs */}
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
          
          {/* Team filter - only shows for News tab */}
          {activeTab === "news" && (
            <div className="py-2 px-4 sm:px-0 bg-background">
              <div className="flex justify-between items-center gap-4">
                <TeamFilter 
                  value={selectedTeam} 
                  onChange={setSelectedTeam}
                />
                <div className="relative w-[220px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar"
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced spacing to prevent content from hiding behind the sticky header - taller on mobile */}
        <div className="h-8 md:h-4"></div>

        <TabsContent value="news" className="space-y-6 pt-6 md:pt-4">          
          {/* Content layout */}
          <div className="space-y-8">
            {filteredArticles.length > 0 ? (
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
                Nenhum artigo encontrado
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="pt-4">
          {/* No filter here as requested */}
          <div className="pt-2">
            <FifaCwcSchedule />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
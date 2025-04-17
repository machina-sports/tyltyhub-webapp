"use client"

import { useState } from "react"
import { Newspaper, Users } from "lucide-react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { SportFilter, TeamFilter } from "@/components/discover/sport-filter"
import { FeaturedArticle } from "@/components/discover/featured-article"
import { ArticleGrid } from "@/components/discover/article-grid"
import { TeamsGrid } from "@/components/discover/teams-grid"
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
  const [activeTab, setActiveTab] = useState("news")

  // Filter articles based on selected team
  const filteredArticles = selectedTeam === "all-teams"
    ? discoverData.articles
    : discoverData.articles.filter(article => {
        // This is a simplified filter that looks for team name in title or description
        // You could enhance this with better matching logic
        const teamName = teamsData.teams.find(t => t.id === selectedTeam)?.name || ""
        return article.title.includes(teamName) || 
               article.description.includes(teamName)
      })

  return (
    <div className="mobile-container pt-20 md:pt-4 pb-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b pb-4 mb-6">
          <TabsList className="bg-background w-full justify-start overflow-x-auto">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="news" className="space-y-8">
          <div className="flex justify-end px-4 sm:px-0">
            <TeamFilter 
              value={selectedTeam} 
              onChange={setSelectedTeam}
            />
          </div>
          <FeaturedArticle article={discoverData.featured} />
          <ArticleGrid articles={filteredArticles} />
        </TabsContent>

        <TabsContent value="teams">
          {/* No filter here as requested */}
          <div className="pt-2">
            <TeamsGrid teams={teamsData.teams} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
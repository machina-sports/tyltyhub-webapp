"use client"

import { useState } from "react"
import { Newspaper, Users, Trophy } from "lucide-react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { SportFilter } from "@/components/discover/sport-filter"
import { FeaturedArticle } from "@/components/discover/featured-article"
import { ArticleGrid } from "@/components/discover/article-grid"
import { TeamsGrid } from "@/components/discover/teams-grid"
import { CompetitionsGrid } from "@/components/discover/competitions-grid"
import discoverData from "@/data/discover.json"

export default function DiscoverPage() {
  const [selectedSport, setSelectedSport] = useState("all sports")
  const [activeTab, setActiveTab] = useState("news")

  const filteredArticles = selectedSport === "all sports"
    ? discoverData.articles
    : discoverData.articles.filter(article => 
        article.category.toLowerCase() === selectedSport
      )

  const filteredTeams = selectedSport === "all sports"
    ? discoverData.teams
    : discoverData.teams.filter(team => 
        team.sport.toLowerCase() === selectedSport
      )

  const filteredCompetitions = selectedSport === "all sports"
    ? discoverData.competitions
    : discoverData.competitions.filter(competition => 
        competition.name.toLowerCase().includes(selectedSport)
      )

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
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Competitions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="news" className="space-y-8">
          <div className="flex justify-end px-4 sm:px-0">
            <SportFilter 
              value={selectedSport} 
              onChange={setSelectedSport}
            />
          </div>
          <FeaturedArticle article={discoverData.featured} />
          <ArticleGrid articles={filteredArticles} />
        </TabsContent>

        <TabsContent value="teams">
          <div className="flex justify-end mb-6 px-4 sm:px-0">
            <SportFilter 
              value={selectedSport} 
              onChange={setSelectedSport}
            />
          </div>
          <TeamsGrid teams={filteredTeams} />
        </TabsContent>

        <TabsContent value="competitions">
          <div className="flex justify-end mb-6 px-4 sm:px-0">
            <SportFilter 
              value={selectedSport} 
              onChange={setSelectedSport}
            />
          </div>
          <CompetitionsGrid competitions={filteredCompetitions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
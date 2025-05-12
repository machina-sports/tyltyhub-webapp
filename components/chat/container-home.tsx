"use client"

import { useState } from "react"

import {
  Search,
  Reply,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"

import { SportingbetDot } from "../ui/dot"

const ContainerHome = ({ query, topQuestions = [] }: { query: string, topQuestions: any[] }) => {

  const router = useRouter()

  const [input, setInput] = useState(query)

  const user_id = "123"

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!input.trim()) return

    router.push(`/chat/new?q=${encodeURIComponent(input)}&user_id=${user_id}`)
  }

  const handleSampleQuery = (text: string) => {
    setInput(text)
  }

  const getInputPlaceholder = () => {
    return "Busque por times, jogos ou odds..."
  }

  return (
    <div className="flex flex-col h-screen bg-background pt-16 md:pt-0">
      <div className="flex-1 overflow-auto hide-scrollbar momentum-scroll pb-32 pt-4 md:pb-24">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
          <h1 className="text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center">
            Qual vai ser a sua aposta?
            <SportingbetDot size={28} className="ml-1" />
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-2 w-full max-w-xl mx-auto">
            {topQuestions.map((text, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                onClick={() => handleSampleQuery(text)}
              >
                <Reply className="h-4 w-4 mr-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContainerHome
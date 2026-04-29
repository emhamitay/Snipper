"use client"

import { useMemo, useState } from "react"
import { Filter, Search } from "lucide-react"
import { EmptyState } from "@/components/vercel/empty-state"
import { SnippetCard } from "@/components/vercel/snippet-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SnippetCardInfo } from "@/lib/db/queries/snippets";

interface SnippetListProps {
  snippets: SnippetCardInfo[]
  languages: string[]
  baseHref: string
  isDashboard?: boolean
}

export default function SnippetList({ snippets, languages, baseHref, isDashboard = false }: SnippetListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<string>("all")

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage =
        languageFilter === "all" || snippet.language === languageFilter

      return matchesSearch && matchesLanguage
    })
  }, [snippets, searchQuery, languageFilter])

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Snippets Grid */}
      {filteredSnippets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              href={`${baseHref}/${snippet.slug}`}
              showVisibility={isDashboard}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No snippets yet"
          description="Create your first snippet to get started organizing your code."
          actionLabel={isDashboard ? "Create Snippet" : undefined}
          actionHref={isDashboard ? "/dashboard/snippets/new" : undefined}
        />
      )}
    </>
  )
}

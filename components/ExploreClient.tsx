// בעה"י
"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PublicSnippetCard } from "@/components/vercel/public-snippet-card"
import { EmptyState } from "@/components/vercel/empty-state"
import { loadMorePublicSnippets } from "@/lib/actions/explore"
import type { PublicSnippetCardInfo, PublicSnippetSort } from "@/lib/db/queries/snippets"
import { languages as ALL_LANGUAGES } from "@/lib/languages"

interface ExploreClientProps {
  initialSnippets: PublicSnippetCardInfo[]
  initialLikedIds: string[]
  isLoggedIn: boolean
  pageSize: number
  initialFilters: {
    search: string
    language: string
    sort: PublicSnippetSort
  }
}

export function ExploreClient({
  initialSnippets,
  initialLikedIds,
  isLoggedIn,
  pageSize,
  initialFilters,
}: ExploreClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchInput, setSearchInput] = useState(initialFilters.search)
  const [snippets, setSnippets] = useState(initialSnippets)
  const [likedIds, setLikedIds] = useState(new Set(initialLikedIds))
  const [hasMore, setHasMore] = useState(initialSnippets.length === pageSize)
  const [isLoading, setIsLoading] = useState(false)
  const [, startTransition] = useTransition()

  // Sync state when server-rendered initial data changes (filter/sort changes)
  useEffect(() => {
    setSnippets(initialSnippets)
    setLikedIds(new Set(initialLikedIds))
    setHasMore(initialSnippets.length === pageSize)
  }, [initialSnippets, initialLikedIds, pageSize])

  function updateParams(next: Partial<{ q: string; language: string; sort: string }>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ q: searchInput.trim() })
  }

  async function onLoadMore() {
    setIsLoading(true)
    try {
      const result = await loadMorePublicSnippets({
        limit: pageSize,
        offset: snippets.length,
        language: initialFilters.language === "all" ? undefined : initialFilters.language,
        search: initialFilters.search || undefined,
        sort: initialFilters.sort,
      })
      setSnippets((prev) => [...prev, ...result.snippets])
      setLikedIds((prev) => {
        const next = new Set(prev)
        for (const id of result.likedIds) next.add(id)
        return next
      })
      setHasMore(result.snippets.length === pageSize)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, description, or tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </form>

        <Select
          value={initialFilters.language}
          onValueChange={(value) => updateParams({ language: value })}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {ALL_LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={initialFilters.sort}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {snippets.length === 0 ? (
        <EmptyState
          title="No public snippets found"
          description="Try a different search or filter."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <PublicSnippetCard
                key={snippet.id}
                snippet={snippet}
                isLoggedIn={isLoggedIn}
                isLiked={likedIds.has(snippet.id)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button onClick={onLoadMore} disabled={isLoading} variant="outline">
                {isLoading ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}

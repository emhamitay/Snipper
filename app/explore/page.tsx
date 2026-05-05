// בעה"י
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NavbarPublic } from "@/components/vercel/navbar-public"
import { Footer } from "@/components/vercel/footer"
import { ExploreClient } from "@/components/ExploreClient"
import {
  getPublicSnippets,
  getLikedSnippetIdsForUser,
  type PublicSnippetSort,
} from "@/lib/db/queries/snippets"

const PAGE_SIZE = 12

export const dynamic = "force-dynamic"

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string
    language?: string
    sort?: string
  }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ""
  const language = params.language && params.language !== "all" ? params.language : undefined
  const sort: PublicSnippetSort = params.sort === "popular" ? "popular" : "newest"

  const snippets = await getPublicSnippets({
    limit: PAGE_SIZE,
    offset: 0,
    language,
    search: search || undefined,
    sort,
  })

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const likedIds = userId
    ? Array.from(await getLikedSnippetIdsForUser(userId, snippets.map((s) => s.id)))
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarPublic />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore snippets</h1>
            <p className="mt-2 text-muted-foreground">
              Discover public code snippets shared by the community.
            </p>
          </div>

          <ExploreClient
            initialSnippets={snippets}
            initialLikedIds={likedIds}
            isLoggedIn={!!userId}
            pageSize={PAGE_SIZE}
            initialFilters={{
              search,
              language: language ?? "all",
              sort,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

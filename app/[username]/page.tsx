// בעה"י

import { notFound } from "next/navigation"
import SnippetList from "@/components/SnippetList"
import { getUserByUsername } from "@/lib/db/queries/users"
import { getPublicSnippetsByUserId } from "@/lib/db/queries/snippets"

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const user = await getUserByUsername(username)

  if (!user) {
    notFound()
  }

  const snippets = await getPublicSnippetsByUserId(user.id)
  const usedLanguages = [...new Set(snippets.map((s) => s.language))]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Public Profile
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              @{username}&apos;s snippets
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              Browse all public code snippets shared by this user.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
            </span>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              @{username}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Snippet collection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and filter public snippets shared by @{username}.
          </p>
        </div>
        <SnippetList
          snippets={snippets}
          languages={usedLanguages}
          baseHref={`/${username}`}
        />
      </div>
    </div>
  )
}


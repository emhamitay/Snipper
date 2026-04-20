// בעה"י

import Link from "next/link"
import { Plus } from "lucide-react"
import SnippetList from "@/components/SnippetList"
import { Button } from "@/components/ui/button"
import { getSnippetsByUserId } from "@/lib/db/queries/snippets"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export default async function DashboardPage() {
  //get all snippets from the database and pass them to the component
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const snippets = await getSnippetsByUserId(userId);
  const username = session?.user?.username
  const uniqueLanguages = new Set(snippets.map((s) => s.language)).size
  const usedLanguages = [...new Set(snippets.map((s) => s.language))]
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Dashboard
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your snippets library
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              Search, filter, and manage your code snippets from one place while
              keeping the same polished flow as the editor and detail pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
            </span>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {uniqueLanguages} {uniqueLanguages === 1 ? "language" : "languages"}
            </span>
            {username ? (
              <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
                @{username}
              </span>
            ) : null}
            <Button asChild>
              <Link href="/dashboard/snippets/new">
                <Plus className="mr-2 h-4 w-4" />
                New Snippet
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Snippet collection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Narrow down by text or language, then open a snippet to view or edit.
          </p>
        </div>
        <SnippetList snippets={snippets} languages={usedLanguages} baseHref="/dashboard/snippets" isDashboard />
      </div>
    </div>
  )
}

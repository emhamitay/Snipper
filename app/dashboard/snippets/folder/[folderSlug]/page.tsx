// בעה"י

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import SnippetList from "@/components/SnippetList"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getFolderBySlug } from "@/lib/db/queries/folders"
import { db } from "@/lib/db"
import { snippets } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderSlug: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const { folderSlug } = await params
  const folder = await getFolderBySlug(session.user.id, folderSlug)

  if (!folder) notFound()

  const folderSnippets = await db.select({
    id: snippets.id,
    title: snippets.title,
    description: snippets.description,
    createdAt: snippets.createdAt,
    language: snippets.language,
    isPublic: snippets.isPublic,
    slug: snippets.slug,
  }).from(snippets).where(
    and(eq(snippets.userId, session.user.id), eq(snippets.folderId, folder.id))
  )

  const uniqueLanguages = [...new Set(folderSnippets.map((s) => s.language))]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Folder
            </div>
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground font-medium">{folder.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {folder.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {folderSnippets.length} {folderSnippets.length === 1 ? "snippet" : "snippets"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Snippets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All snippets in this folder.
          </p>
        </div>
        <SnippetList
          snippets={folderSnippets}
          languages={uniqueLanguages}
          baseHref="/dashboard/snippets/snippet"
          isDashboard
        />
      </div>
    </div>
  )
}

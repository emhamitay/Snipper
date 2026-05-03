// בעה"י

import SnippetList from "@/components/SnippetList"
import { DashboardActions } from "@/components/DashboardActions"
import { getRootSnippetsByUserId, getSnippetCountsByFolderForUser } from "@/lib/db/queries/snippets"
import { getFoldersByUserId } from "@/lib/db/queries/folders"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { FolderCard } from "@/components/vercel/folder-card"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const username = session?.user?.username

  const [snippets, folders, folderCounts] = await Promise.all([
    getRootSnippetsByUserId(userId),
    getFoldersByUserId(userId),
    getSnippetCountsByFolderForUser(userId),
  ])

  const uniqueLanguages = [...new Set(snippets.map((s) => s.language))]
  const totalSnippets = snippets.length
  const totalFolders = folders.length

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
              Search, filter, and manage your code snippets from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {totalSnippets} {totalSnippets === 1 ? "snippet" : "snippets"}
            </span>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {totalFolders} {totalFolders === 1 ? "folder" : "folders"}
            </span>
            {username && (
              <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
                @{username}
              </span>
            )}
            <DashboardActions />
          </div>
        </div>
      </div>

      {folders.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Folders</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your snippet folders.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DashboardActions showSnippetButton={false} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                href={`/dashboard/snippets/folder/${folder.slug}`}
                snippetCount={folderCounts[folder.id] ?? 0}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Snippets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Snippets not in any folder.
          </p>
        </div>
        <SnippetList
          snippets={snippets}
          languages={uniqueLanguages}
          baseHref="/dashboard/snippets/snippet"
          isDashboard
        />
      </div>
    </div>
  )
}

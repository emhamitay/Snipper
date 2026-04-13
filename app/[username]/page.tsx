// בעה"י

import { use } from "react"
import { NavbarPublic } from "@/components/vercel/navbar-public"
import { SnippetCard } from "@/components/vercel/snippet-card"
import { EmptyState } from "@/components/vercel/empty-state"
import { mockUser, publicSnippets } from "@/lib/mock-data"

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)

  // In a real app, fetch user data by username
  const user = username === mockUser.username ? mockUser : null
  const snippets = user ? publicSnippets.filter((s) => s.authorUsername === username) : []

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavbarPublic />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="mt-2 text-muted-foreground">
              The user you are looking for does not exist.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarPublic />

      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Profile Header */}
          <div className="mb-8 border-b border-border pb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                {user.bio && (
                  <p className="mt-2 max-w-xl text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Public Snippets */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Public Snippets ({snippets.length})
            </h2>
            {snippets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {snippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    href={`/${username}/${snippet.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No public snippets"
                description="This user hasn&apos;t shared any public snippets yet."
                icon="file"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// בעה"י

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NavbarPublic } from "@/components/vercel/navbar-public"
import { CodeBlock } from "@/components/vercel/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { publicSnippets, languageColors, mockUser } from "@/lib/mock-data"

export default function PublicSnippetPage({ 
  params 
}: { 
  params: Promise<{ username: string; snippetId: string }> 
}) {
  const { username, snippetId } = use(params)

  const snippet = publicSnippets.find(
    (s) => s.id === snippetId && s.authorUsername === username
  )

  if (!snippet) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavbarPublic />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Snippet not found</h1>
            <p className="mt-2 text-muted-foreground">
              The snippet you are looking for does not exist or is private.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const colorClass = languageColors[snippet.language] || "bg-muted text-muted-foreground"
  const author = username === mockUser.username ? mockUser : null

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarPublic />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link href={`/${username}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{snippet.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className={colorClass}>
                {snippet.language}
              </Badge>
              <span className="text-sm text-muted-foreground">
                by{" "}
                <Link 
                  href={`/${username}`} 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  @{username}
                </Link>
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(snippet.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {snippet.description && (
              <p className="mt-4 text-muted-foreground">{snippet.description}</p>
            )}
          </div>

          {/* Code Block */}
          <CodeBlock code={snippet.code} language={snippet.language} />

          {/* Author Info */}
          {author && (
            <div className="mt-8 rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {author.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link 
                    href={`/${username}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {author.displayName}
                  </Link>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

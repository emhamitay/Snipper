// בעה"י

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SnippetDetailsPanel } from "@/components/SnippetDetailsPanel"
import Shiki from "@/components/Shiki"
import { getSnippetById } from "@/lib/db/queries/snippets"
import { getUserByUsername } from "@/lib/db/queries/users"
import { FloatingCopyButton } from "@/components/FloatingCopyButton"

export default async function PublicSnippetPage({
  params,
}: {
  params: Promise<{ username: string; snippetId: string }>
}) {
  const { username, snippetId } = await params

  const [user, snippet] = await Promise.all([
    getUserByUsername(username),
    getSnippetById(snippetId),
  ])

  if (!user || !snippet || snippet.userId !== user.id || !snippet.isPublic) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href={`/${username}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </Button>

      <SnippetDetailsPanel snippet={snippet} authorUsername={username} publicSnippetUrl="">
        <Shiki code={snippet.code} lang={snippet.language} />
      </SnippetDetailsPanel>
      <FloatingCopyButton code={snippet.code} />
    </div>
  )
}


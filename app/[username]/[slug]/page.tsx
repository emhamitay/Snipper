// בעה"י

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SnippetDetailsPanel } from "@/components/SnippetDetailsPanel"
import Shiki from "@/components/Shiki"
import { getSnippetBySlug } from "@/lib/actions/snippets"
import { FloatingCopyButton } from "@/components/FloatingCopyButton"
import { getSnippetLikes } from "@/lib/actions/likes"
import { getSnippetTags } from "@/lib/actions/tags"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export default async function PublicSnippetPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>
}) {
  const { username, slug } = await params
  const session = await getServerSession(authOptions)

  const snippet = await getSnippetBySlug(username, slug)

  if (!snippet || !snippet.isPublic) {
    notFound()
  }

  const [likesData, tagsData] = await Promise.all([
    getSnippetLikes(snippet.id),
    getSnippetTags(snippet.id),
  ])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href={`/${username}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </Button>

      <SnippetDetailsPanel
        snippet={snippet}
        authorUsername={username}
        publicSnippetUrl=""
        likesCount={likesData.count}
        isLiked={likesData.isLiked}
        tags={tagsData.map((t) => t.name)}
        isLoggedIn={!!session?.user}
      >
        <Shiki code={snippet.code} lang={snippet.language} />
      </SnippetDetailsPanel>
      <FloatingCopyButton code={snippet.code} />
    </div>
  )
}




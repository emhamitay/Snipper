// בעה"י

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SnippetDetailsPanel } from "@/components/SnippetDetailsPanel"
import Shiki from "@/components/Shiki"
import { getSnippetById } from "@/lib/db/queries/snippets"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { headers } from "next/headers"
import { buildAbsolutePublicUrl, buildPublicSnippetPath, getRequestOrigin } from "@/lib/public-url"

export default async function SnippetViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const headerStore = await headers()
  const appOrigin = getRequestOrigin(headerStore)
  const { id } = await params
  const snippet = await getSnippetById(id);
  const username = session?.user?.username ?? ""

  if (!snippet) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Snippet not found</h1>
          <p className="mt-2 text-muted-foreground">
            The snippet you are looking for does not exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const publicSnippetPath = buildPublicSnippetPath(username, snippet.id)
  const publicSnippetUrl = buildAbsolutePublicUrl(appOrigin, publicSnippetPath)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <SnippetDetailsPanel snippet={snippet} authorUsername={username} publicSnippetUrl={publicSnippetUrl}>
        <Shiki code={snippet.code} lang={snippet.language} />
      </SnippetDetailsPanel>
    </div>
  )
}

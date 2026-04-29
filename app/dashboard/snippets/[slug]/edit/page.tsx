// בעה"י
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import SnippetEditorForm from "@/components/SnippetEditorForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSnippetBySlug } from "@/lib/db/queries/snippets"
import { getSnippetTags } from "@/lib/actions/tags"

export default async function EditSnippetPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const { slug } = await params
  const snippet = await getSnippetBySlug(session.user.id, slug)
  
  if (!snippet) {
    // ... logic below will handle it
  }

  const tagsData = snippet ? await getSnippetTags(snippet.id) : []


  if (!snippet) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-8">
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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href={`/dashboard/snippets/${snippet.slug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Snippet
        </Link>
      </Button>

      <SnippetEditorForm snippet={snippet} initialTags={tagsData.map(t => t.name)} />
    </div>
  )
}


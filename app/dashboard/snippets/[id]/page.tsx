"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Globe, Lock, Copy, Check, ExternalLink } from "lucide-react"
import { NavbarDashboard } from "@/components/navbar-dashboard"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { mockSnippets, languageColors } from "@/lib/mock-data"

export default function SnippetViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [copiedLink, setCopiedLink] = useState(false)

  const snippet = mockSnippets.find((s) => s.id === id)

  if (!snippet) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavbarDashboard />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Snippet not found</h1>
            <p className="mt-2 text-muted-foreground">
              The snippet you are looking for does not exist.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const colorClass = languageColors[snippet.language] || "bg-muted text-muted-foreground"
  const publicUrl = `https://snippr.app/${snippet.authorUsername}/${snippet.id}`

  const handleDelete = () => {
    // Simulate delete
    router.push("/dashboard")
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarDashboard />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{snippet.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="secondary" className={colorClass}>
                    {snippet.language}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    {snippet.isPublic ? (
                      <>
                        <Globe className="h-3.5 w-3.5" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        Private
                      </>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(snippet.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/snippets/${snippet.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete snippet?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        snippet and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {snippet.description && (
              <p className="mt-4 text-muted-foreground">{snippet.description}</p>
            )}
          </div>

          {/* Code Block */}
          <CodeBlock code={snippet.code} language={snippet.language} />

          {/* Public Share Link */}
          {snippet.isPublic && (
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium mb-1">Public share link</p>
                  <p className="truncate text-sm text-muted-foreground font-mono">
                    {publicUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    {copiedLink ? (
                      <>
                        <Check className="mr-1.5 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${snippet.authorUsername}/${snippet.id}`} target="_blank">
                      <ExternalLink className="mr-1.5 h-3 w-3" />
                      Open
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

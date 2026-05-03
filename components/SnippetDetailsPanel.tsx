// בעה"י
"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Globe, Lock, Copy, Check, ExternalLink } from "lucide-react"
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
import { languageColors } from "@/lib/languages"
import type { Snippet } from "@/lib/db/queries/snippets"
import { deleteSnippet } from "@/lib/actions/snippets"
import { LikeButton } from "./LikeButton"

interface SnippetDetailsPanelProps {
  snippet: Snippet;
  authorUsername: string;
  publicSnippetUrl: string;
  isDashboard?: boolean;
  children?: ReactNode;
  likesCount?: number;
  isLiked?: boolean;
  tags?: string[];
  isLoggedIn?: boolean;
}

export function SnippetDetailsPanel({
  snippet,
  authorUsername,
  publicSnippetUrl,
  isDashboard = false,
  children,
  likesCount = 0,
  isLiked = false,
  tags = [],
  isLoggedIn = false,
}: SnippetDetailsPanelProps) {
  const router = useRouter()
  const [copiedLink, setCopiedLink] = useState(false)

  const colorClass =
    languageColors[snippet.language] || "bg-muted text-muted-foreground"
  const publicPath = `/${authorUsername}/${snippet.slug}`


  const handleDelete = () => {
    // Simulate delete
    deleteSnippet(snippet.id)
      .then(() => {
        router.push("/dashboard")
      })
      .catch((error) => {
        console.error("Failed to delete snippet:", error)
        // Optionally show an error message to the user
      })
  }

  const handleCopyLink = async () => {
    if (!publicSnippetUrl) return
    await navigator.clipboard.writeText(publicSnippetUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 rounded-3xl border border-border/70 bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Snippet overview
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {snippet.title}
              </h1>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className={colorClass}>
                {snippet.language}
              </Badge>
              <span className="flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
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
              <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
                {new Date(snippet.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${tag}`}
                    className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {snippet.description && (
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                {snippet.description}
              </p>
            )}

            <div className="mt-6 sm:hidden">
              <LikeButton
                snippetId={snippet.id}
                initialCount={likesCount}
                initialIsLiked={isLiked}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="hidden sm:block">
              <LikeButton
                snippetId={snippet.id}
                initialCount={likesCount}
                initialIsLiked={isLiked}
                isLoggedIn={isLoggedIn}
              />
            </div>
            {isDashboard && (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/snippets/snippet/${snippet.slug}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete snippet?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your snippet and remove it from our servers.
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
              </>
            )}
          </div>
        </div>
      </div>



			{/* Code Block */}
			<div className="space-y-3">
				<div className="flex items-center justify-between px-1">
					<div>
						<h2 className="text-lg font-semibold tracking-tight">Source code</h2>
						<p className="text-sm text-muted-foreground">Formatted for readability with a tighter editor-style frame.</p>
					</div>
				</div>
				{children}
			</div>

			{/* Public Share Link */}
		{isDashboard && snippet.isPublic && (
				<div className="mt-8 rounded-2xl border border-border/70 bg-linear-to-r from-muted/40 via-background to-muted/20 p-4 shadow-sm sm:p-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="min-w-0 flex-1">
							<p className="mb-1 text-sm font-medium">Public share link</p>
							<p className="truncate rounded-lg bg-background/80 px-3 py-2 text-sm font-mono text-muted-foreground">
								{publicSnippetUrl || "set a username"}
							</p>
						</div>
						<div className="flex items-center gap-2 self-end sm:self-auto">
							<Button variant="outline" size="sm" onClick={handleCopyLink} disabled={!publicSnippetUrl}>
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
								<Link href={publicSnippetUrl || publicPath || "#"} target="_blank" onClick={(event) => {
									if (!publicSnippetUrl) event.preventDefault()
								}}>
									<ExternalLink className="mr-1.5 h-3 w-3" />
									Open
								</Link>
							</Button>
						</div>
					</div>
				</div>
			)}
	</>
	)
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, Lock, Globe, MoreHorizontal, Pencil, Trash2, FolderInput } from "lucide-react"
import { languageColors } from "@/lib/languages"
import type { SnippetCardInfo } from "@/lib/db/queries/snippets"
import { deleteSnippet } from "@/lib/actions/snippets"
import { MoveToFolderDialog } from "@/components/vercel/move-to-folder-dialog"

interface SnippetCardProps {
  snippet: SnippetCardInfo
  href: string
  showVisibility?: boolean
}

export function SnippetCard({ snippet, href, showVisibility = false }: SnippetCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const colorClass = languageColors[snippet.language] || "bg-muted text-muted-foreground"

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteSnippet(snippet.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete snippet:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <Card className="group relative transition-all hover:shadow-md hover:border-primary/20">
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {snippet.title}</span>
      </Link>
      <CardHeader className="pb-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-medium leading-snug line-clamp-2 wrap-break-word">
              {snippet.title}
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {showVisibility && (
              <span className="text-muted-foreground">
                {snippet.isPublic ? (
                  <Globe className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </span>
            )}
            <Badge variant="secondary" className={`max-w-36 truncate text-xs ${colorClass}`}>
              {snippet.language}
            </Badge>
            {/* z-20 to sit above the card's link overlay (z-10) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative z-20 h-7 w-7 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/snippets/snippet/${snippet.slug}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowMoveDialog(true)}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Move to folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete snippet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{snippet.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <MoveToFolderDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        snippetId={snippet.id}
        snippetTitle={snippet.title}
        currentFolderId={snippet.folderId ?? null}
      />
      <CardContent>
        <CardDescription className="line-clamp-2 mb-3 text-sm">
          {snippet.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(snippet.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="relative z-20 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
          >
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

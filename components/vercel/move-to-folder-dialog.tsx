"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Folder, FolderX, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getFoldersByUserId } from "@/lib/actions/folders"
import { moveSnippetToFolder } from "@/lib/actions/snippets"
import type { Folder as FolderType } from "@/lib/db/queries/folders"

interface MoveToFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  snippetId: string
  snippetTitle: string
  currentFolderId: string | null
}

export function MoveToFolderDialog({
  open,
  onOpenChange,
  snippetId,
  snippetTitle,
  currentFolderId,
}: MoveToFolderDialogProps) {
  const router = useRouter()
  const [folders, setFolders] = useState<FolderType[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(currentFolderId)

  useEffect(() => {
    if (!open) return
    setSelectedId(currentFolderId)
    setLoading(true)
    getFoldersByUserId()
      .then(setFolders)
      .catch(() => toast.error("Failed to load folders"))
      .finally(() => setLoading(false))
  }, [open, currentFolderId])

  const hasChange = (selectedId ?? null) !== (currentFolderId ?? null)

  async function handleSave() {
    if (!hasChange) {
      onOpenChange(false)
      return
    }
    setSaving(true)
    try {
      await moveSnippetToFolder(snippetId, selectedId)
      const target = selectedId
        ? folders.find((f) => f.id === selectedId)?.name ?? "folder"
        : "No folder"
      toast.success(`Moved “${snippetTitle}” to ${target}`)
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to move snippet")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move snippet</DialogTitle>
          <DialogDescription className="truncate">
            Move &ldquo;{snippetTitle}&rdquo; to a different folder.
          </DialogDescription>
        </DialogHeader>

        <Command className="rounded-md border">
          <CommandInput placeholder="Search folders..." />
          <CommandList className="max-h-64">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <>
                <CommandEmpty>No folders found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="__none__ no folder root"
                    onSelect={() => setSelectedId(null)}
                    className="cursor-pointer"
                  >
                    <FolderX className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>No folder</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedId === null ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
                {folders.length > 0 && <CommandSeparator />}
                {folders.length > 0 && (
                  <CommandGroup heading="Folders">
                    {folders.map((folder) => (
                      <CommandItem
                        key={folder.id}
                        value={folder.name}
                        onSelect={() => setSelectedId(folder.id)}
                        className="cursor-pointer"
                      >
                        <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{folder.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedId === folder.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChange}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Moving...
              </>
            ) : (
              "Move"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// בעה"י
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AvailabilityInput, type AvailabilityStatus } from "@/components/AvailabilityInput"
import { createFolder, isFolderNameAvailable } from "@/lib/actions/folders"

interface CreateFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFolderModal({ open, onOpenChange }: CreateFolderModalProps) {
  const router = useRouter()
  const [folderName, setFolderName] = useState("")
  const [nameStatus, setNameStatus] = useState<AvailabilityStatus>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const resetState = () => {
    setFolderName("")
    setNameStatus("idle")
    setIsLoading(false)
    setError("")
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const handleCreate = async () => {
    if (nameStatus !== "available") {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await createFolder(folderName)
      router.refresh()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>

        <AvailabilityInput
          id="folderName"
          label="Folder name"
          placeholder="e.g. Work, Side projects..."
          checkAvailability={(value) => {
            setFolderName(value)
            return isFolderNameAvailable(value)
          }}
          onStatusChange={setNameStatus}
          availableMessage="Name is available"
          takenMessage="You already have a folder with this name"
          validate={(value) => value.trim().length >= 1}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading || nameStatus !== "available"}>
            {isLoading ? "Creating..." : "Create folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

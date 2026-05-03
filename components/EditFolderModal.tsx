// בעה"י
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AvailabilityInput, type AvailabilityStatus } from "@/components/AvailabilityInput"
import { isFolderNameAvailable, updateFolder } from "@/lib/actions/folders"

interface EditFolderModalProps {
  folderId: string
  currentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFolderModal({ folderId, currentName, open, onOpenChange }: EditFolderModalProps) {
  const router = useRouter()
  const [folderName, setFolderName] = useState(currentName)
  const [nameStatus, setNameStatus] = useState<AvailabilityStatus>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [inputKey, setInputKey] = useState(0)

  const resetState = () => {
    setFolderName(currentName)
    setNameStatus("idle")
    setIsLoading(false)
    setError("")
    setInputKey((prev) => prev + 1)
  }

  useEffect(() => {
    if (open) {
      resetState()
    }
  }, [open, currentName])

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const handleSave = async () => {
    if (nameStatus !== "available") {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await updateFolder(folderId, folderName)
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
          <DialogTitle>Edit folder</DialogTitle>
        </DialogHeader>

        <AvailabilityInput
          key={inputKey}
          id="folderName"
          label="Folder name"
          placeholder="e.g. Work, Side projects..."
          checkAvailability={(value) => {
            setFolderName(value)
            return isFolderNameAvailable(value, folderId)
          }}
          onStatusChange={setNameStatus}
          availableMessage="Name is available"
          takenMessage="You already have a folder with this name"
          validate={(value) => value.trim().length >= 1}
          initialValue={currentName}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || nameStatus !== "available"}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

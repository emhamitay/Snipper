// בעה"י
"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateFolderModal } from "@/components/CreateFolderModal"

interface DashboardActionsProps {
  showSnippetButton?: boolean
}

export function DashboardActions({ showSnippetButton = true }: DashboardActionsProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </Button>
      {showSnippetButton && (
        <Button asChild>
          <Link href="/dashboard/snippets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Snippet
          </Link>
        </Button>
      )}
      <CreateFolderModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}

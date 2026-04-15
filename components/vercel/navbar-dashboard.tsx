// בעה"י
"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Code2, Copy, ExternalLink, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/vercel/theme-toggle"
import LogoutButton from "../LogoutButton"

const username = "johndoe"
const profileUrl = `snippr.app/${username}`

export function NavbarDashboard() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(`https://${profileUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Snippr</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/snippets/new">
              <Plus className="mr-2 h-4 w-4" />
              New Snippet
            </Link>
          </Button>

          <div className="flex items-center gap-0.5 rounded-md border border-border/50 px-2 py-1">
            <span className="text-sm text-muted-foreground">{profileUrl}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
              {copied
                ? <Check className="h-3 w-3 text-green-500" />
                : <Copy className="h-3 w-3 text-muted-foreground" />}
              <span className="sr-only">Copy profile URL</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <a href={`https://${profileUrl}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="sr-only">Open public profile</span>
              </a>
            </Button>
          </div>

          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

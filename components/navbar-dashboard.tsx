"use client"

import Link from "next/link"
import { Code2, LogOut, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function NavbarDashboard() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

// בעה"י
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Code2, Copy, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/vercel/theme-toggle";
import LogoutButton from "../LogoutButton";
import { useSession } from "next-auth/react";
import { buildAbsolutePublicUrl, buildPublicProfilePath } from "@/lib/public-url";

interface NavbarDashboardProps {
  appOrigin: string;
}

export function NavbarDashboard({ appOrigin }: NavbarDashboardProps) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const username = session?.user?.username ?? "";
  const profilePath = buildPublicProfilePath(username);
  const fullProfileUrl = buildAbsolutePublicUrl(appOrigin, profilePath);
  const displayUrl = fullProfileUrl || "set a username";

  function handleCopy() {
    if (!fullProfileUrl) return;
    navigator.clipboard.writeText(fullProfileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Snippr</span>
        </Link>

        <div className="flex items-center gap-2">
          

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Public profile: 
            </span>
            <div className="flex items-center gap-0.5 rounded-md border border-border/60 bg-muted/30 px-2 py-1 transition-colors hover:bg-muted/50">
              <span className="max-w-45 truncate text-sm text-foreground/80">
                {displayUrl || "set a username"}{" "}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
                disabled={!fullProfileUrl}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="sr-only">Copy profile URL</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <a
                  href={fullProfileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!fullProfileUrl}
                  onClick={(event) => {
                    if (!fullProfileUrl) event.preventDefault();
                  }}
                >
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <span className="sr-only">Open public profile</span>
                </a>
              </Button>
            </div>
          </div>

          <Button asChild>
            <Link href="/dashboard/snippets/new">
              <Plus className="mr-2 h-4 w-4" />
              New Snippet
            </Link>
          </Button>

          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

// בעה"י
import Link from "next/link";
import { Code2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/vercel/theme-toggle";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import LogoutButton from "../LogoutButton";

export async function NavbarPublic() {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Snippr</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <>
              {username ? (
                <span className="hidden rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground sm:inline-flex">
                  @{username}
                </span>
              ) : null}
              <Button asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

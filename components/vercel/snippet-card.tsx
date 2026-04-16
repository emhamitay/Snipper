// בעה"י
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Lock, Globe } from "lucide-react"
import { type Snippet, languageColors } from "@/lib/languages"

interface SnippetCardProps {
  snippet: Snippet
  href: string
  showVisibility?: boolean
}

export function SnippetCard({ snippet, href, showVisibility = false }: SnippetCardProps) {
  const colorClass = languageColors[snippet.language] || "bg-muted text-muted-foreground"

  return (
    <Card className="group relative transition-all hover:shadow-md hover:border-primary/20">
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {snippet.title}</span>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium truncate">{snippet.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showVisibility && (
              <span className="text-muted-foreground">
                {snippet.isPublic ? (
                  <Globe className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </span>
            )}
            <Badge variant="secondary" className={`text-xs ${colorClass}`}>
              {snippet.language}
            </Badge>
          </div>
        </div>
      </CardHeader>
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

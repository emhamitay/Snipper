// בעה"י
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { languageColors } from "@/lib/languages"
import { LikeButton } from "@/components/LikeButton"
import type { PublicSnippetCardInfo } from "@/lib/db/queries/snippets"

interface PublicSnippetCardProps {
  snippet: PublicSnippetCardInfo
  isLoggedIn: boolean
  isLiked: boolean
}

export function PublicSnippetCard({ snippet, isLoggedIn, isLiked }: PublicSnippetCardProps) {
  const colorClass = languageColors[snippet.language] || "bg-muted text-muted-foreground"
  const href = `/${snippet.username}/${snippet.slug}`

  return (
    <Card className="group relative flex flex-col transition-all hover:shadow-md hover:border-primary/20">
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {snippet.title}</span>
      </Link>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium truncate">{snippet.title}</CardTitle>
            <Link
              href={`/${snippet.username}`}
              className="relative z-20 mt-1 inline-block text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              @{snippet.username}
            </Link>
          </div>
          <Badge variant="secondary" className={`shrink-0 text-xs ${colorClass}`}>
            {snippet.language}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between">
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
          <div className="relative z-20">
            <LikeButton
              snippetId={snippet.id}
              initialCount={snippet.likeCount}
              initialIsLiked={isLiked}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

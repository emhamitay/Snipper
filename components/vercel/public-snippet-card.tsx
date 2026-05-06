// בעה"י
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { languageColors } from "@/lib/languages"
import { LikeButton } from "@/components/LikeButton"
import { ArrowRight } from "lucide-react"
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
    <Card className="group relative flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 overflow-hidden">
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {snippet.title}</span>
      </Link>

      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-primary" />
      </div>

      <CardHeader className="pb-2">
        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {snippet.title}
            </CardTitle>
            <Link
              href={`/${snippet.username}`}
              className="relative z-20 mt-1 inline-block text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              by @{snippet.username}
            </Link>
          </div>
          <Badge variant="outline" className={`shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass} border-none shadow-sm`}>
            {snippet.language}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between">
        <CardDescription className="line-clamp-2 mb-4 text-sm leading-relaxed text-muted-foreground/90">
          {snippet.description || "No description provided."}
        </CardDescription>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-[10px] font-medium uppercase tracking-tight text-muted-foreground/60">
            {new Date(snippet.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <div className="relative z-20 scale-90 origin-right">
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

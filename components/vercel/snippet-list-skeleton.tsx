// בעה"י

import { Skeleton } from "@/components/ui/skeleton"

interface SnippetListSkeletonProps {
  count?: number
}

export function SnippetListSkeleton({ count = 6 }: SnippetListSkeletonProps) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-full sm:w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <SnippetCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

function SnippetCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-4/5" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  )
}

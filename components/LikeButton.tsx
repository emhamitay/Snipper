// בעה"י
"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/lib/actions/likes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LikeButtonProps {
  snippetId: string;
  initialCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
}

export function LikeButton({
  snippetId,
  initialCount,
  initialIsLiked,
  isLoggedIn,
}: LikeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like snippets", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      try {
        await toggleLike(snippetId);
      } catch (error) {
        // Rollback on error
        setIsLiked(!newIsLiked);
        setCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
        toast.error("Failed to update like");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "group h-9 gap-2 rounded-full border-border/70 px-4 transition-all duration-300",
        isLiked
          ? "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20 hover:text-red-700"
          : "hover:bg-muted/50"
      )}
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform duration-300 group-active:scale-125",
          isLiked ? "fill-current scale-110" : "fill-none"
        )}
      />
      <span className="text-sm font-medium">{count}</span>
    </Button>
  );
}

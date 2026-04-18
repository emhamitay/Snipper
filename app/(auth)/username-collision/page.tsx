"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/vercel/theme-toggle";
import {
  AvailabilityInput,
  type AvailabilityStatus,
} from "@/components/AvailabilityInput";
import { getGithubUserIdFromSession, registerGithubUser } from "@/lib/actions/users";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isUsernameAvailable } from "@/lib/actions/users";

export default function UsernameCollisionPage() {

  const { update } = useSession();
  const router = useRouter();
  const [usernameStatus, setUsernameStatus] = useState<AvailabilityStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus !== "available") return;
    setIsLoading(true);
    setError("");

    const username = new FormData(e.currentTarget).get("username") as string;

    try {
      const githubId = await getGithubUserIdFromSession();
      if (!githubId) {
        router.push("/");
        return;
      }
      await registerGithubUser(username, githubId);
      await update({ clearUsernameCollision: true , username });
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    isLoading || usernameStatus !== "available";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Snippr</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Username already taken</CardTitle>
            <CardDescription>
              Your GitHub username is already in use on Snippr. Please choose a
              different one.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AvailabilityInput
                id="username"
                label="Username"
                placeholder="Choose a username"
                checkAvailability={isUsernameAvailable}
                onStatusChange={setUsernameStatus}
                availableMessage="Username is available"
                takenMessage="Username is taken"
                validate={(value) => value.length >= 3}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
              >
                {isLoading ? "Continuing..." : "Continue"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                This is the only time you&apos;ll be asked to do this.
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
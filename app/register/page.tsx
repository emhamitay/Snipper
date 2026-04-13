// בעה"י
"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Code2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/vercel/theme-toggle";
import type { AvailabilityStatus } from "@/components/AvailabilityInput";
import { AvailabilityInput } from "@/components/AvailabilityInput";
import { signIn } from "next-auth/react";
import { isUsernameAvailable, isEmailAvailable , registerUser } from "@/lib/actions/users"; // actions 

const takenUsernames = ["admin", "user", "test", "johndoe", "demo"];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<AvailabilityStatus>("idle");
  const [emailStatus, setEmailStatus] = useState<AvailabilityStatus>("idle");

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus !== "available" || emailStatus !== "available") return;
    setIsLoading(true);

    //get data
    const formData = new FormData(e.currentTarget);
    const username: string = formData.get('username') as string;
    const email: string = formData.get('email') as string;
    const password: string = formData.get('password') as string;

    const user = await registerUser(username,email,password); //register action
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    router.push("/dashboard");
  };

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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Get started with Snippr for free</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AvailabilityInput
                id="username"
                label="Username"
                placeholder="johndoe"
                checkAvailability={isUsernameAvailable}
                onStatusChange={setUsernameStatus}
                availableMessage="Username is available"
                takenMessage="Username is taken"
                validate={(value) => {
                  const result: boolean = value.length < 3 ? false : true;
                  return result;
                }}
              />

              <AvailabilityInput
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                checkAvailability={isEmailAvailable}
                onStatusChange={setEmailStatus}
                availableMessage="Email is available"
                takenMessage="Email already registered"
                validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
              />
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name='password'
                  placeholder="Create a password"
                  required
                  onChange={(e)=>{
                    setPassword(e.target.value);
                  }}
                />
                { password.length < 8 && password.length != 0 && (
                  <>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-red-500" /></div>
                  <p className="text-xs text-red-500">Password length should be atlist 8 characters</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                { confirmPassword.length != 0 && password != confirmPassword && password.length > 8 && password.length != 0 && (
                  <>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-red-500" /></div>
                  <p className="text-xs text-red-500">Password doesn't match</p>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || 
                  usernameStatus !== "available" || 
                  emailStatus !== "available" ||
                  password.length < 8 ||
                  confirmPassword != password
                }
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}

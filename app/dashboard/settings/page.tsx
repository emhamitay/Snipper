"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NavbarDashboard } from "@/components/navbar-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUser } from "@/lib/mock-data"

const MAX_BIO_LENGTH = 160

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState(mockUser.displayName)
  const [bio, setBio] = useState(mockUser.bio)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarDashboard />

      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account settings and public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={mockUser.username}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your username cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={mockUser.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bio">Bio</Label>
                    <span className={`text-xs ${bio.length > MAX_BIO_LENGTH ? "text-destructive" : "text-muted-foreground"}`}>
                      {bio.length}/{MAX_BIO_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={MAX_BIO_LENGTH}
                  />
                </div>

                <Button type="submit" disabled={isLoading || bio.length > MAX_BIO_LENGTH}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

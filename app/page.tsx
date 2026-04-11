import Link from "next/link"
import { NavbarPublic } from "@/components/navbar-public"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Paintbrush, Share2, Copy } from "lucide-react"

const features = [
  {
    icon: FolderOpen,
    title: "Organize your snippets",
    description: "Keep all your code snippets in one place, organized by language and tags.",
  },
  {
    icon: Paintbrush,
    title: "Syntax highlighting",
    description: "Beautiful syntax highlighting for over 100 programming languages.",
  },
  {
    icon: Share2,
    title: "Share publicly",
    description: "Share your snippets with the world or keep them private for yourself.",
  },
  {
    icon: Copy,
    title: "Copy with one click",
    description: "Quickly copy any snippet to your clipboard with a single click.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarPublic />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Your personal code{" "}
              <span className="text-primary">snippet library</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Save, organize, and share your code snippets. Access them from anywhere, with syntax highlighting and instant copy.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4 py-24">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/40 bg-card/50">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40">
          <div className="container mx-auto max-w-6xl px-4 py-24">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Ready to organize your code?
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Join thousands of developers who use Snippr to manage their code snippets.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/register">Sign up for free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

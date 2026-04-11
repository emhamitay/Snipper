import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-center gap-4 px-4 text-sm text-muted-foreground">
        <Link 
          href="https://portfolio.example.com" 
          className="hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </Link>
        <span className="text-border">|</span>
        <Link 
          href="https://tailwinddesigner.example.com" 
          className="hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind Designer
        </Link>
      </div>
    </footer>
  )
}

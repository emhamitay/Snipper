// בעה"י
"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-zinc-100 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  )
}

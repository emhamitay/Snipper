"use client"

import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"

export function FloatingCopyButton({ code }: { code: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const header = document.querySelector("[data-code-panel-header]")
    if (!header) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    // Outer shell mirrors the page container so the button aligns with the panel's right edge
    <div
      className={[
        "fixed inset-x-0 top-[72px] z-40 pointer-events-none",
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
      ].join(" ")}
    >
      <div className="container mx-auto max-w-4xl pr-8 flex justify-end">
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className={[
            "pointer-events-auto",
            "flex items-center gap-2 rounded-lg px-3 py-2",
            "border border-white/10 bg-slate-900/90 backdrop-blur-sm text-slate-300",
            "shadow-lg shadow-black/30 text-xs font-medium",
            "transition-colors duration-150",
            "hover:bg-slate-800/95 hover:text-white hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
            "active:scale-95",
          ].join(" ")}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 shrink-0" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// בעה"י

import { codeToHtml } from "shiki";
import { CopyButton } from "@/components/CopyButton";

const THEME = "github-dark";

interface ShikiProps {
  code: string;
  lang: string;
}

const Shiki = async ({ code, lang }: ShikiProps) => {
  const html = await codeToHtml(code, {
    lang,
    theme: THEME,
  });
  const safeHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  return (
    <div className="rounded-2xl border border-border/70 bg-slate-950 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.75)]">
      {/* Header — language badge, normal flow */}
      <div data-code-panel-header className="flex items-center justify-between border-b border-white/8 px-4 py-2.5 rounded-t-2xl">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
          {lang}
        </span>
        {/* Copy button — sticky to top-right of the viewport as user scrolls */}
        <div className="top-0 z-10">
          <CopyButton code={code} />
        </div>
      </div>
      {/* Code content */}
      <div
        className="overflow-x-auto rounded-b-2xl [&_.shiki]:bg-transparent! [&_.shiki]:m-0 [&_.shiki]:min-w-full [&_.shiki]:p-5 [&_.shiki]:text-[13px] [&_.shiki]:leading-6 sm:[&_.shiki]:p-6 sm:[&_.shiki]:text-sm [&_.shiki_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
};

export default Shiki;
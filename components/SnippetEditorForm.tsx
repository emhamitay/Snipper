// בעה"י
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useTopProgress } from "@/components/top-progress";
import CodeMirror from "@uiw/react-codemirror";
import type { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { php } from "@codemirror/lang-php";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageColors, languages } from "@/lib/languages";
import type { AvailabilityStatus } from "@/components/AvailabilityInput";
import { AvailabilityInput } from "@/components/AvailabilityInput";
import {
  createSnippet,
  isSnippetTitleAvailable,
  isSnippetSlugAvailable,
  updateSnippet,
} from "@/lib/actions/snippets";

import type { Snippet } from "@/lib/db/queries/snippets";
import type { Folder } from "@/lib/db/queries/folders";
import { TagInput } from "./TagInput";

interface SnippetEditorFormProps {
  snippet?: Snippet | null;
  initialTags?: string[];
  folders?: Folder[];
}

function getLanguageExtension(lang: string): Extension[] {
  switch (lang) {
    case "javascript":
      return [javascript()];
    case "typescript":
      return [javascript({ typescript: true })];
    case "python":
      return [python()];
    case "rust":
      return [rust()];
    case "go":
      return [go()];
    case "java":
      return [java()];
    case "cpp":
      return [cpp()];
    case "html":
      return [html()];
    case "css":
      return [css()];
    case "sql":
      return [sql()];
    case "json":
      return [json()];
    case "yaml":
      return [yaml()];
    case "markdown":
      return [markdown()];
    case "xml":
      return [xml()];
    case "php":
      return [php()];
    case "bash":
      return [];
    default:
      return [];
  }
}

export default function SnippetEditorForm({ snippet, initialTags = [], folders }: SnippetEditorFormProps) {
  const router = useRouter();
  const { start, done } = useTopProgress();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<AvailabilityStatus>(
    snippet ? "available" : "idle",
  );
  const [description, setDescription] = useState(snippet?.description ?? "");
  const [code, setCode] = useState(snippet?.code ?? "");
  const [isPublic, setIsPublic] = useState(snippet?.isPublic ?? true);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [folderId, setFolderId] = useState<string | null>(snippet?.folderId ?? null);

  const [language, setLanguage] = useState(snippet?.language || "typescript");

  useEffect(() => {
    if (!snippet?.language) {
      const preferred = localStorage.getItem("snippr:preferred-language");
      if (preferred) setLanguage(preferred);
    }
  }, [snippet?.language]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("snippr:preferred-language", lang);
  };

  const isEditing = Boolean(snippet);
  const cancelHref = isEditing
    ? `/dashboard/snippets/snippet/${snippet?.slug}`
    : "/dashboard";
  const colorClass =
    languageColors[language] || "bg-muted text-muted-foreground";
  const pageEyebrow = isEditing ? "Edit snippet" : "Create snippet";
  const pageTitle = isEditing ? snippet?.title || "Untitled snippet" : "Create a new snippet";
  const pageDescription = isEditing
    ? "Refine the title, code, and visibility without leaving the editor flow."
    : "Draft a polished snippet with the same structure and presentation as the detail view.";
  const submitLabel = isEditing ? "Save Changes" : "Save Snippet";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleStatus !== "available") {
      setSubmitError("Please choose an available snippet name.");
      return;
    }
    setSubmitError(null);
    setIsLoading(true);
    start();
    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string | null) ?? "";

    const snippetPayload = {
      title,
      language,
      description,
      code,
      isPublic,
      tags,
      folderId,
    };

    try {
      if (snippet) {
        await updateSnippet(snippet.id, snippetPayload);
        toast.success("Snippet updated");
        router.push(`/dashboard/snippets/snippet/${snippet.slug}`);
      } else {
        await createSnippet(snippetPayload);
        toast.success("Snippet created");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save snippet. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      done();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {pageEyebrow}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {pageDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Badge variant="secondary" className={colorClass}>
              {language}
            </Badge>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Snippet details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set the title, language, and context that will appear alongside
              the code.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <AvailabilityInput
                id="title"
                label="Snippet name"
                placeholder="Snippet title..."
                initialValue={snippet?.title ?? ""}
                checkAvailability={(value) =>
                  isSnippetSlugAvailable(value, snippet?.id)
                }
                onStatusChange={setTitleStatus}
                availableMessage="URL slug is available"
                takenMessage="URL slug is already taken"
                validate={(value) => value.trim().length > 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your snippet..."
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Select
                value={folderId ?? "none"}
                onValueChange={(value) => setFolderId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {(folders ?? []).map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput tags={tags} setTags={setTags} />
            </div>
          </div>
        </div>


        <div className="rounded-2xl border border-border/70 bg-linear-to-b from-background to-muted/20 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight">Publishing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Decide whether this snippet stays private or gets a shareable
              public link.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="public" className="text-base font-medium">
                  Public Snippet
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Make this snippet visible to everyone.
                </p>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
            {isPublic
              ? "Public snippets can be opened directly from your profile and shared with a full URL."
              : "Private snippets stay visible only inside your dashboard until you publish them."}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-semibold tracking-tight">Source code</h2>
          <p className="text-sm text-muted-foreground">
            Edit inside a framed editor so the writing flow matches the final
            snippet presentation.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-slate-950 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.75)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
              {language}
            </span>
          </div>
          <div className="bg-slate-950 p-0 [&_.cm-editor]:min-h-90 [&_.cm-editor]:bg-transparent [&_.cm-editor]:text-sm [&_.cm-gutters]:bg-slate-950 [&_.cm-gutters]:text-slate-500 [&_.cm-scroller]:font-mono [&_.cm-activeLine]:bg-white/5 [&_.cm-activeLineGutter]:bg-white/5 [&_.cm-focused]:outline-none">
            <CodeMirror
              id="code"
              value={code}
              extensions={getLanguageExtension(language)}
              onChange={(value) => setCode(value)}
              theme="dark"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-medium text-foreground">
            {isEditing
              ? "Ready to update this snippet?"
              : "Ready to publish this snippet?"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Saving will update the snippet page immediately."
              : "You can keep iterating later from the dashboard or snippet page."}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={isLoading}
            disabled={titleStatus !== "available"}
          >
            {isLoading ? "Saving..." : submitLabel}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {submitError}
        </div>
      )}
    </form>
  );
}

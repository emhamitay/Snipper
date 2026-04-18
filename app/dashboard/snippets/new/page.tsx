// בעה"י
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { languages } from "@/lib/languages";
import CodeMirror from "@uiw/react-codemirror";

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
import type { Extension } from "@codemirror/state";
import { createSnippet } from "@/lib/actions/snippets";


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
      return []; // no official package, plain text
    default:
      return [];
  }
}

export default function NewSnippetPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    const snippet = {
      title,
      language,
      description,
      code,
      isPublic,
    };

    try {
      await createSnippet(snippet);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating snippet:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create snippet. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Snippet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Snippet title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
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
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <CodeMirror
                value={code}
                extensions={getLanguageExtension(language)}
                onChange={(value) => setCode(value)}
                theme="dark"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="public" className="text-base font-medium">
                  Public Snippet
                </Label>
                <p className="text-sm text-muted-foreground">
                  Make this snippet visible to everyone
                </p>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Snippet"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>

            {submitError && (
              <p role="alert" className="text-sm text-destructive">
                {submitError}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

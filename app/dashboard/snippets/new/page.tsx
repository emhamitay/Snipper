// בעה"י
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SnippetEditorForm from "@/components/SnippetEditorForm";

export default function NewSnippetPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <SnippetEditorForm />
    </div>
  );
}

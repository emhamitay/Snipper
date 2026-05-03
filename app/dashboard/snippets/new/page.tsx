// בעה"י
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SnippetEditorForm from "@/components/SnippetEditorForm";
import { getFoldersByUserId } from "@/lib/actions/folders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewSnippetPage() {
  const session = await getServerSession(authOptions);
  const folders = session?.user?.id ? await getFoldersByUserId() : [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <SnippetEditorForm folders={folders} />
    </div>
  );
}

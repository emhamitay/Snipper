// בעה"י

import SnippetList from "@/components/SnippetList"
import { getSnippetsByUserId } from "@/lib/db/queries/snippets"
import { languages } from "@/lib/mock-data"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export default async function DashboardPage() {
  //get all snippets from the database and pass them to the component
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const snippets = await getSnippetsByUserId(userId);
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <SnippetList snippets={snippets} languages={languages} />
    </div>
  )
}

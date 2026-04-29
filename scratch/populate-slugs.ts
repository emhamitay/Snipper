// בעה"י
import { db } from "../lib/db";
import { snippets } from "../lib/db/schema";
import { generateSlug } from "../lib/slug";

import { eq, isNull } from "drizzle-orm";

async function main() {
  const allSnippets = await db.select().from(snippets).where(isNull(snippets.slug));
  console.log(`Found ${allSnippets.length} snippets without slugs.`);

  for (const snippet of allSnippets) {
    const slug = generateSlug(snippet.title);
    console.log(`Updating [${snippet.title}] -> [${slug}]`);
    await db.update(snippets).set({ slug }).where(eq(snippets.id, snippet.id));
  }

  console.log("Migration complete.");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

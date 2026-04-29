// בעה"י
const { db } = require("./lib/db");
const { snippets, users } = require("./lib/db/schema");

async function main() {
  const s = await db.select().from(snippets);
  console.log("Snippets in DB:");
  s.forEach(x => console.log(` - ID: ${x.id}, Title: ${x.title}, Slug: ${x.slug}, UserID: ${x.userId}, Public: ${x.isPublic}`));

  
  const u = await db.select().from(users);
  console.log("Users in DB:");
  u.forEach(x => console.log(` - ID: ${x.id}, Username: ${x.username}`));
  
  process.exit(0);
}

main();

// בעה"י
import { users } from "../schema";
import { db } from "../index"
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export async function isUsernameAvailable(username: string) : Promise<boolean> {
    const user = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
    return user.length === 0; // if length is 0, username is available
}

export async function isEmailAvailable(email: string) : Promise<boolean> {
    const user = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    return user.length === 0; // if length is 0, email is available
}

export async function getUserByEmail(email: string) : Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user[0] || null; // return the user object or null if not found
}

export async function registerUser(newUser : NewUser){
    return await db.insert(users).values(newUser).returning();
}

export async function getGithubUserByGithubId(githubId: string) : Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.githubId, githubId)).limit(1);
    return user[0] || null; // return the user object or null if not found
}
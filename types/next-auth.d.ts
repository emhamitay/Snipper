// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      githubId?: string;
    } & DefaultSession["user"];
    usernameCollision?: boolean;
  }
}
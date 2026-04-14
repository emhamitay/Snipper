import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
    usernameCollision?: boolean; // add a flag to indicate username collision
  }
}
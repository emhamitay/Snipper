// בעה"י
// lib/auth.ts (v4 pattern)
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { getGithubUserByGithubId, getUserByEmail } from "./db/queries/users";
import bcrypt from "bcryptjs";
import { isUsernameAvailable, registerGithubUser } from "./actions/users";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!passwordMatch) return null;

        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (trigger === "update" && session?.clearUsernameCollision) {
        delete token.usernameCollision;
        delete token.githubId;
        if (session?.username) {
          token.username = session.username;
        }
      }

      if (account?.provider === "github") {
        const githubId = String((profile as any)?.id);
        token.githubId = githubId;

        let existingUser = await getGithubUserByGithubId(githubId);

        if (!existingUser) {
          const username = (profile as any)?.login;
          const isUsernameTaken = !(await isUsernameAvailable(
            username as string,
          ));

          if (!isUsernameTaken) {
            await registerGithubUser(username as string, githubId);
            existingUser = await getGithubUserByGithubId(githubId);
          } else {
            token.usernameCollision = true;
          }
        }

        if (existingUser) {
          token.sub = existingUser.id;
          token.username = existingUser.username;
        }
        return token;
      }

      // Stale token fix: on the very first GitHub sign-in, older versions of this code
      // set token.sub to GitHub's numeric ID instead of our DB UUID. If we detect a
      // numeric sub on a subsequent request (account is absent on non-sign-in requests),
      // we look up the real user by githubId and correct token.sub in place.
      // In practice this only fires for tokens issued before this logic existed.
      const subIsNumeric = token.sub && Number.isFinite(Number(token.sub));
      const githubIdInToken = token.githubId as string | undefined;
      if (!account && subIsNumeric) {
        const githubId = githubIdInToken ?? token.sub!;
        const fixedUser = await getGithubUserByGithubId(githubId);
        if (fixedUser) {
          token.sub = fixedUser.id;
          token.username = fixedUser.username;
        }
        return token;
      }

      if (user) {
        token.sub = user.id;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      if (token.username) {
        session.user.username = token.username as string;
      }
      if (token.usernameCollision) {
        session.usernameCollision = true;
        session.user.githubId = token.githubId as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

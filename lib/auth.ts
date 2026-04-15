// בעה"י
// lib/auth.ts  (v4 pattern)
import { NextAuthOptions } from "next-auth";
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

      // handle the update trigger - this is used after the user choose a username in the username collision page, we would update the session to remove the collision flag and githubId from the session and token
      if (trigger === "update" && session?.clearUsernameCollision) {
        delete token.usernameCollision;
        delete token.githubId;
      }

      // check if the user is signing in with github
      if (account?.provider === "github") {
        // github , not like credentials, force a redirect to the callback url (we can't tell dont redirect and check if the user exists and if the username is taken at the register page , altough it was cleaner to do it
        // therefor, the solution is to login here BUT if there is username collusion we would update the session
        // in the layout.tsx check for that session and if there is a collision, we would redirect the user to choose a diffrante username
        // if username was free from the start we would create the user here.

        const githubId = String((profile as any)?.id);
        let existingUser = await getGithubUserByGithubId(githubId as string);
        if (!existingUser) {
          // check if the username is taken
          const username = (profile as any)?.login; // github username
          const isUsernameTaken = !(await isUsernameAvailable(
            username as string,
          ));
          if (!isUsernameTaken) {
            // register the user
            await registerGithubUser(username as string, githubId as string);
            token.usernameCollision = false; // set a flag in the token to indicate no username collision
          } else {
            token.usernameCollision = true; // set a flag in the token to indicate username collision
            // also add the githubId to the token so we can use it later to register the user after he choose a username
            token.githubId = githubId;
          }
        }
      }
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      if (token.usernameCollision) {
        session.usernameCollision = true; // pass the username collision flag to the session
        session.user.githubId = token.githubId as string; // pass the githubId to the session
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

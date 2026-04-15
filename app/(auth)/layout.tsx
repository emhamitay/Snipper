import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// need to check here if user is logged with credentials, if logged redirect to dashboard
// if logged with github , we need to check if there is a username collision, if there is, redirect to username collision page, if not, redirect to dashboard

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.usernameCollision) {
    redirect("/username-collision");
  } else if (session) {
    // user is logged in and there is no username collision, redirect to dashboard
    redirect("/dashboard");
  }

  // if there aint a session let them continue (login \ register page)

  return <>{children}</>;
}

export default AuthLayout;

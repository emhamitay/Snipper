import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth";
import { NavbarDashboard } from "@/components/vercel/navbar-dashboard";

//this layout is primary used as a validation layer - spacielly for github auth, but it can also be used for other things in the future
async function DashboardLayout({children} : {children:React.ReactNode}) {
    const session = await getServerSession(authOptions);
    if(session?.usernameCollision) {
      redirect('/username-collision');
    }
    
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarDashboard />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
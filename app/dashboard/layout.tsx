import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { authOptions } from "@/lib/auth";
import { NavbarDashboard } from "@/components/vercel/navbar-dashboard";
import { getRequestOrigin } from '@/lib/public-url';

//this layout is primary used as a validation layer - spacielly for github auth, but it can also be used for other things in the future
async function DashboardLayout({children} : {children:React.ReactNode}) {
    const session = await getServerSession(authOptions);
    const headerStore = await headers();
    const appOrigin = getRequestOrigin(headerStore);
    if(session?.usernameCollision) {
      redirect('/username-collision');
    }
    
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarDashboard appOrigin={appOrigin} />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
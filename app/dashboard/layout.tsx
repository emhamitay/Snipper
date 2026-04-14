import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

//this layout is primary used as a validation layer - spacielly for github auth, but it can also be used for other things in the future
async function DashboardLayout({children} : {children:React.ReactNode}) {
    const session = await getServerSession();
    if(session?.usernameCollision) redirect('/username-collision');
    
  return (
    <>
      {children}
    </>
  );
};

export default DashboardLayout;
// בעה"י
'use client';
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/login" });
          }}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </button>
      </Button>
    </>
  );
};

export default LogoutButton;

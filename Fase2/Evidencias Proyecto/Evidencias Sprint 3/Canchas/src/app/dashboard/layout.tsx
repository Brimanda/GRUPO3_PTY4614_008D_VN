"use client";

import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/components/component/auth/AuthProvider";
import "@/app/globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useAuth();  
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
            {children}
      </body>
    </html>
  );
}

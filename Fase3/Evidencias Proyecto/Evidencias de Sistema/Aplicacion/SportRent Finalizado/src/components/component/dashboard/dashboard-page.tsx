"use client";

import { SVGProps, useState } from "react";
import { DashboardReservasComponent } from "@/components/dashboard-reservas";
import SidebarComponent from "./sidebar";
import { Input } from "@/components/ui/input";

export function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarComponent/>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <main className="flex-1 p-4 sm:p-6">
          <DashboardReservasComponent />
        </main>
      </div>
    </div>
  );
}

const SearchIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);


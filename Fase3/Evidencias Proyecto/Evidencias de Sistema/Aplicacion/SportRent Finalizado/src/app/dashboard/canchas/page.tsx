"use client";
import Link from "next/link";
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { JSX, SVGProps } from "react";
import { useRouter } from "next/navigation";
import SidebarComponent from "@/components/component/dashboard/sidebar";
import CanchasDisponiblesComponent from "@/components/component/dashboard/canchas/canchas-disponibles";


export default function ConceptArtPage() {
  
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarComponent/>
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar..." className="w-full rounded-md bg-muted pl-8 sm:w-[300px]" />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
        <CanchasDisponiblesComponent/>
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

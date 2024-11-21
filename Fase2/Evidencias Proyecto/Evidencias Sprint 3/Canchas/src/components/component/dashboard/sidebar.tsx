'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Calendar, Layout, Users, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthProvider";

export default function SidebarComponent() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleMouseOver = () => setSidebarOpen(true);
    const handleMouseOut = () => setSidebarOpen(false);

    const sidebarElement = document.getElementById("sidebar");
    if (sidebarElement) {
      sidebarElement.addEventListener("mouseover", handleMouseOver);
      sidebarElement.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener("mouseover", handleMouseOver);
        sidebarElement.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <aside
      id="sidebar"
      className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-celeste-claro to-azul transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-full flex-col items-center gap-4 px-4 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-blue-600">
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav className="flex text-blanco flex-1 flex-col items-center space-y-4 pt-8">
          <NavItem href="/" icon={<Home />} label="Inicio" isOpen={isSidebarOpen} />
          <NavItem href="/dashboard" icon={<Layout />} label="Panel" isOpen={isSidebarOpen} />
          <NavItem href="/dashboard/canchas" icon={<Calendar />} label="Canchas" isOpen={isSidebarOpen} />
          <NavItem href="/dashboard/reservas" icon={<Users />} label="Reservas" isOpen={isSidebarOpen} />
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="mt-auto text-blanco hover:bg-blue-700 hover:text-blanco"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          {isSidebarOpen && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, isOpen }: { href: string; icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg p-3 text-white transition-colors hover:bg-blue-700 ${
        isOpen ? 'w-full justify-start' : 'w-12 justify-center'
      }`}
    >
      {icon}
      {isOpen && <span className="ml-3">{label}</span>}
    </Link>
  );
}

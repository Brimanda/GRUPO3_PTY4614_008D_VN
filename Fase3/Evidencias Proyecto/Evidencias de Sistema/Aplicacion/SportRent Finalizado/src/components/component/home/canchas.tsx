"use client";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import { JSX, SVGProps, useMemo } from "react";
import { useState, useEffect } from "react";
import { getCanchas } from "@/app/lib/canchas";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { CanchasDeportivas } from "./canchas/cancha-list";

export function Canchas() {
  const [canchas, setCanchas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const canchasData = await getCanchas();
        setCanchas(canchasData);
      } catch (err) {
        setError("Error al cargar los datos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const transformedData = useMemo(() => {
    return [...canchas].slice(0, 9).map(item => ({
      ...item,
      image_url: item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg"
    }));
  }, [canchas]);


  return (
    <div>
      <br />
      <CanchasDeportivas/>
    </div>
  )
}

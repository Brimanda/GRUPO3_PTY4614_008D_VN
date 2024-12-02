"use client";

import { useAuth } from "@/components/component/auth/AuthProvider";
import HomePage from "@/components/component/home/home-page";

export default function Home() {
  const { session } = useAuth();

  return (
    <HomePage/>
  );
}

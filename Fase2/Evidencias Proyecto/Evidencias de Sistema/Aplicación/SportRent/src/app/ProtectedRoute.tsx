"use client";
import { useAuth } from "@/components/component/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        console.log(session)
      } else {
        router.push("/dashboard");
        setChecked(true);
        console.log(session) 
      }
    };
    checkAuth(); 
  }, [router]);

  // Renderizado condicional
  if (isLoading || !checked) {
    return <p>Cargando...</p>; 
  } else if (!session) {
    return null; 
  } else {
    return <>{children}</>; 
  }
};

export default ProtectedRoute;

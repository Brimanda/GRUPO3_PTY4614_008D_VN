"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from "@/app/lib/supabase";
import { VerifyOtpParams, VerifyEmailOtpParams, VerifyTokenHashParams } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code") || "";
        const type = urlParams.get("type") as VerifyOtpParams['type'] || "";

        if (!code || !type) {
          throw new Error(`Faltan parámetros en la URL: code=${code}, type=${type}`);
        }

        let error;
        if (type === 'signup' || type === 'email_change') {
          ({ error } = await supabase.auth.verifyOtp({
            type,
            email: code,
          } as VerifyEmailOtpParams));
        } else if (type === 'recovery') {
          ({ error } = await supabase.auth.verifyOtp({
            type,
            token_hash: code,
          } as VerifyTokenHashParams));
        } else {
          throw new Error("Tipo de verificación no válido");
        }

        if (error) {
          setError(error.message);
        } else {
          if (type === 'recovery') {
            router.push("/auth/reset-password");
          } else {
            router.push("/auth/confirm");
          }
        }
      } catch (error: any) {
        setError(error.message || "Error inesperado en el proceso de autenticación.");
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div>
      {isLoading ? (
        <p>Verificando...</p>
      ) : error ? (
        <div>
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <p>Verificación exitosa. Redirigiendo...</p>
      )}
    </div>
  );
}

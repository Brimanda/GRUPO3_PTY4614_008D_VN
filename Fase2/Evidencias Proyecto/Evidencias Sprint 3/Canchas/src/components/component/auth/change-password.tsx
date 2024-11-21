"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export function ChangePassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://sportrent.vercel.app/auth/callback?type=recovery",
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.error("Error al enviar el correo de restablecimiento:", error);
      setError(error.message || "Ha ocurrido un error inesperado");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription>
            Ingresa tu dirección de correo electrónico y te enviaremos un enlace
            para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Dirección de correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            {success && <p className="mt-1 text-sm text-green-500">Correo de restablecimiento enviado. Revisa tu bandeja de entrada.</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Restablecer contraseña
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-muted-foreground">
          ¿Recuerdas tu contraseña?{" "}
          <Link href="/login" className="font-medium underline" prefetch={false}>
            Iniciar sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

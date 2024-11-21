"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function RegisterPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "cliente",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (Object.values(formData).some((field) => field === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.username,
        formData.nombre,
        formData.apellidos,
        formData.userType
      );

      router.push("/auth/confirm"); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Crear una cuenta</h1>
          <p className="text-sm text-gray-600 mt-2">Regístrate para comenzar</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              name="apellidos"
              type="text"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Tipo de usuario:</span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="cliente"
                checked={formData.userType === "cliente"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Cliente</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="arrendador"
                checked={formData.userType === "arrendador"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Arrendador</span>
            </label>
          </div>
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          <Button type="submit" className="w-full bg-negro text-blanco hover:bg-blue-700">
            Registrarse
          </Button>
        </form>
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
          <br />
          <br />
          <Link href="/" className="text-blue-600 hover:underline">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

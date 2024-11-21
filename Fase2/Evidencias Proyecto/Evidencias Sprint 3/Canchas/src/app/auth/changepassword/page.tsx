"use client"; // Indica que es un componente del cliente
import { ChangePassword } from "@/components/component/auth/change-password";

export default function ChangePass() {

  return (
    <div className="container mx-auto w-[400px]">
      <ChangePassword/>
    </div>
  );
}
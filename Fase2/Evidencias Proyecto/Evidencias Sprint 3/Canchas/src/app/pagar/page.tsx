"use client";

import { useAuth } from "@/components/component/auth/AuthProvider";
import { ReservapagoComponent } from "@/components/component/home/reserva-pago";
import { Suspense } from "react";

export default function Nosotros(){
    return (
        <Suspense fallback={<div>Cargando...</div>}>
        <ReservapagoComponent />
        </Suspense>
    )
}
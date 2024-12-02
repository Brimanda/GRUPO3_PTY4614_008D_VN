import { Suspense } from 'react';
import { ConfirmacionReservaComponent } from "@/components/component/home/confirmacion-reserva";
import { FooterComponent } from "@/components/component/home/footer";
import { HeaderComponent } from "@/components/component/home/header";

export default function ConfirmarReserva() {
  return (
    <>
      <HeaderComponent />
      <Suspense fallback={<div>Cargando...</div>}>
        <ConfirmacionReservaComponent />
      </Suspense>
      <FooterComponent />
    </>
  );
}

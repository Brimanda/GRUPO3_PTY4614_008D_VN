'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { HeaderComponent } from "@/components/component/home/header"
import { FooterComponent } from '@/components/component/home/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabase } from '@/app/lib/supabase'
import { getOwnerFullName, getUserFullName } from '@/app/lib/profiles'

export function ReservapagoComponent() {
  const [isWebpaySelected, setIsWebpaySelected] = useState(false)
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [propietarioEmail, setPropietarioEmail] = useState<string | null>(null);
  const [propietarioName, setPropietarioName] = useState<string | null>(null); 

  const canchaNombre = searchParams.get('nombre') || 'Cancha';
  const duracionHoras = searchParams.get('duracion') || '1';
  const precio = Math.round(parseFloat(searchParams.get('precio') || '0'));
  const ubicacion = searchParams.get('ubicacion') || 'No especificado';
  const capacidad = searchParams.get('capacidad') || 'No especificado';
  const canchaId = searchParams.get('cancha_id');
  const fecha = searchParams.get('fecha') || new Date().toISOString();
  const subtotal = precio;
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const obtenerUsuario = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error obteniendo la sesión:", error);
      setError("Error obteniendo la sesión del usuario.");
    } else if (session) {
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? null);

      const fullName = await getUserFullName(session.user.id);
      setUserFullName(fullName);
    }
  };

  const obtenerEmailPropietario = async (canchaId: string) => {
    try {
      const { data: canchaData, error: canchaError } = await supabase
        .from('canchas')
        .select('propietario_id')
        .eq('id', canchaId)
        .single();
  
      if (canchaError) {
        console.error("Error obteniendo el propietario:", canchaError);
        setError("Error obteniendo el propietario de la cancha.");
        return;
      }
  
      const propietarioId = canchaData?.propietario_id;
  
      if (!propietarioId) {
        setError("No se encontró propietario para esta cancha.");
        return;
      }
  
      const { data: userData, error: userError } = await supabase
        .from('view_users') 
        .select('email')
        .eq('id', propietarioId)
        .single();
  
      if (userError) {
        console.error("Error obteniendo el email del propietario:", userError);
        setError("Error obteniendo el email del propietario.");
        return;
      }
  
      const propietarioEmail = userData?.email ?? null;
      setPropietarioEmail(propietarioEmail);
      
      const fullName = await getOwnerFullName(propietarioId);
      setPropietarioName(fullName); 
  
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Ocurrió un error inesperado.");
    }
  };

  useEffect(() => {
    obtenerUsuario();
    if (canchaId) {
      obtenerEmailPropietario(canchaId);
    }
  }, [canchaId]);

  const handleWebpayChange = (checked: boolean) => {
    setIsWebpaySelected(checked)
  }


  const handleWebpayPayment = async () => {
    try {
      const response = await fetch('/api/transaccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: total,
          sessionId: `session-${Date.now()}`,
          buyOrder: `order-${Date.now()}`,
          returnUrl: `${window.location.origin}/confirmacion-pago`
        })
      });
  
      if (response.ok) {
        const { url, token } = await response.json();
  
        const reservaDetalles = {
          canchaNombre,
          duracionHoras,
          precio,
          subtotal,
          iva,
          total,
          metodoPago: "Webpay",
        };
        localStorage.setItem('reservaDetalles', JSON.stringify(reservaDetalles));
  
        const { error: pagoError } = await supabase.from('pagos').insert([{
          canchanombre: canchaNombre,
          precio: precio,
          subtotal: subtotal,
          iva: iva,
          total: total,
          metodopago: "Webpay",
          user_id: userId,
        }]);
  
        if (pagoError) {
          console.error('Error al insertar los datos de pago:', pagoError);
          setError('Error al registrar el pago. Por favor, inténtalo de nuevo.');
          return;
        }
  
        const fechaReserva = new Date(fecha);
        const { data, error: reservaError } = await supabase.from('reservas').insert([{
          user_id: userId,
          cancha_id: canchaId,
          fecha: fechaReserva,
          estado: 'confirmada',
          nombre_cancha: canchaNombre,
          ubicacion: ubicacion,
          capacidad: capacidad,
        }]);
  
        if (reservaError) {
          console.error('Error al insertar la reserva:', reservaError);
          setError('Ocurrió un error al confirmar la reserva. Por favor, inténtalo de nuevo.');
          return;
        }

        try {
          const responseUsuario = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userFullName,
              email: userEmail,
              fecha: fechaReserva.toISOString().split('T')[0],
              lugar: ubicacion,
              nombreCancha: canchaNombre,
              capacidad: capacidad,
              propietarioEmail: propietarioEmail,
              propietarioName: propietarioName,
            })
          });
  
          if (!responseUsuario.ok) {
            console.error('Error al enviar el correo de confirmación al usuario');
          }
  
        } catch (err) {
          console.error('Error en la solicitud de envío de correo:', err);
        }
  
        window.location.href = `${url}?token_ws=${token}`;
      } else {
        console.error('Error en la transacción:', response.statusText);
        setError('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar el pago con Webpay:', error);
      setError('Error al conectar con el servicio de pago.');
    }
  };
  

  return (

    <div className="min-h-screen flex flex-col bg-sky-50">
      <div className="bg-white shadow-sm">
        <HeaderComponent />
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto border-2 border-celeste-claro">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-celeste-claro">Finalizar Compra</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-2 border-sky-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-celeste-claro">Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>{canchaNombre} - {duracionHoras} horas</span>
                  <span>${precio}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%)</span>
                  <span>${iva}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-celeste-claro pt-2 border-t border-celeste-claro">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-sky-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-celeste-claro">Seleccionar Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="webpay" checked={isWebpaySelected} onCheckedChange={handleWebpayChange} />
                  <Label htmlFor="webpay">Webpay</Label>
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <div className="flex justify-end p-4">
            <Button onClick={handleWebpayPayment} className="bg-celeste-claro hover:bg-celeste-oscuro" disabled={loading}>
              {loading ? 'Procesando...' : 'Pagar y Confirmar'}
            </Button>
          </div>
          {error && <div className="text-red-600 text-center py-2">{error}</div>}
          {success && <div className="text-green-600 text-center py-2">¡Reserva confirmada exitosamente!</div>}
        </Card>
      </main>
      <FooterComponent />
    </div>
  );
}

'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar, Users } from "lucide-react";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getUserFullName } from '@/app/lib/profiles';
import { getOwnerFullName } from '@/app/lib/profiles'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ConfirmacionReservaComponent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [propietarioEmail, setPropietarioEmail] = useState<string | null>(null);
  const [propietarioName, setPropietarioName] = useState<string | null>(null); 

  const nombre = searchParams.get('nombre') || 'No especificado';
  const ubicacion = searchParams.get('ubicacion') || 'No especificado';
  const capacidad = searchParams.get('capacidad') || 'No especificado';
  const canchaId = searchParams.get('cancha_id');
  const fecha = searchParams.get('fecha') || new Date().toISOString();

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

  const obtenerHoraActual = () => {
    return new Date();
  };

  const confirmarReserva = async () => {
    setLoading(true);
    setError(null);
  
    if (!canchaId || !userId) {
      setError('Faltan algunos datos necesarios para confirmar la reserva.');
      setLoading(false);
      return;
    }
  
    const fechaReserva = new Date(fecha);
  
    const { data, error } = await supabase.from('reservas').insert([{
      user_id: userId,
      cancha_id: parseInt(canchaId),
      fecha: fechaReserva,
      estado: 'confirmada',
      nombre_cancha: nombre,
      ubicacion: ubicacion,
      capacidad: capacidad,
    }]);
  
    if (error) {
      console.error('Error al insertar la reserva:', error);
      setError('Ocurrió un error al confirmar la reserva. Por favor, inténtalo de nuevo.');
    } else {
      console.log('Reserva insertada:', data);
      setSuccess(true);
  
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
            nombreCancha: nombre,
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
    }
  
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Reserva Confirmada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">Tu reserva ha sido confirmada exitosamente.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Confirmación de Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          <div className="bg-green-100 border-l-4 border-green-500 p-4 flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            <p className="text-green-700">Tu reserva está casi lista. Por favor, revisa los detalles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-blue-500" />
              <div>
                <p className="font-semibold">Fecha</p>
                <p className="text-sm text-gray-600">{new Date(fecha).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-500" />
              <div>
                <p className="font-semibold">Hora</p>
                <p className="text-sm text-gray-600">{new Date(fecha).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-blue-500" />
              <div>
                <p className="font-semibold">Nombre de la cancha</p>
                <p className="text-sm text-gray-600">{nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-blue-500" />
              <div>
                <p className="font-semibold">Ubicación</p>
                <p className="text-sm text-gray-600">{ubicacion}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-blue-500" />
              <div>
                <p className="font-semibold">Capacidad</p>
                <p className="text-sm text-gray-600">{capacidad}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={confirmarReserva} disabled={loading || !userId} className="w-full">
            {loading ? "Confirmando..." : "Confirmar Reserva"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

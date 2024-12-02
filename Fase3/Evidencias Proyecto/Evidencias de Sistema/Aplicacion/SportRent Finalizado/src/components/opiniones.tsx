import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import useRealtimeReservas from '@/app/hooks/useRealtimeReservas';
import { getUserFullName } from '@/app/lib/profiles';

interface OpinionesCard {
  courtName: string;
  courtImage: string;
  courtLocation: string;
  clientName: string;
  comment: string;
  rating: number;
}

function OpinionesUsuariosCard({
  courtName,
  courtImage,
  courtLocation,
  clientName,
  comment,
  rating,
}: OpinionesCard) {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image
          src={courtImage || "/placeholder.svg"}
          alt={courtName}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-lg font-semibold text-blanco">{courtName}</h2>
          <div className="flex items-center text-blanco/80 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{courtLocation}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">{clientName}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-amarillo fill-amarillo' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <Badge className="text-xs bg-celeste-claro">
            Reseña Verificada
          </Badge>
        </div>
        <p className="text-gray-600 italic">"{comment}"</p>
      </CardContent>
    </Card>
  );
}

export default function OpinionesCard() {
  const [reviews, setReviews] = useState<OpinionesCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReviews = async () => {
    try {
      const { data: reservas, error } = await supabase
        .from('reservas')
        .select(`
          id,
          user_id,
          nombre_cancha,
          ubicacion,
          comentario,
          puntuacion,
          created_at,
          canchas (imagen)
        `)
        .eq('estado', 'confirmada')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      if (!reservas || reservas.length === 0) {
        console.log('No se encontraron reseñas.');
        setReviews([]);
        return;
      }
  
      const reviewsWithUserNames = await Promise.all(
        reservas.map(async (reserva: any) => {
          const clientName = await getUserFullName(reserva.user_id);
  
          if (reserva.comentario && reserva.puntuacion !== null) {
            return {
              courtName: reserva.nombre_cancha || 'Nombre de cancha no disponible',
              courtImage: reserva.canchas?.imagen?.[0] || "/placeholder.svg",
              courtLocation: reserva.ubicacion || 'Ubicación no disponible',
              clientName: clientName || 'Usuario desconocido',
              comment: reserva.comentario || 'Comentario no disponible',
              rating: reserva.puntuacion || 0,
            };
          }
          return null; 
        })
      );
  
      setReviews(reviewsWithUserNames.filter(review => review !== null));
  
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  

  useRealtimeReservas(fetchReviews);
  useEffect(() => {
    fetchReviews();
  }, []);

  const nextReviews = () => {
    if (currentIndex + 3 < reviews.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const prevReviews = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Reseñas de Canchas Deportivas</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={prevReviews}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-celeste-claro text-blanco rounded-l-lg disabled:bg-gray-400"
        >
          Anterior
        </button>
        <button
          onClick={nextReviews}
          disabled={currentIndex + 3 >= reviews.length}
          className="px-4 py-2 bg-azul-claro text-blanco rounded-r-lg disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.length > 0 ? (
          reviews.slice(currentIndex, currentIndex + 3).map((review, index) => (
            <OpinionesUsuariosCard key={index} {...review} />
          ))
        ) : (
          <p>No hay reseñas disponibles.</p>
        )}
      </div>
    </div>
  );
}

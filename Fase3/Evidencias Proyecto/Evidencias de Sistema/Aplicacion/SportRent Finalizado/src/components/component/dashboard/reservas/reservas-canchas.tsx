'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, DollarSign, Calendar } from "lucide-react"
import { supabase } from '@/app/lib/supabase'
import { getUserFullName } from '@/app/lib/profiles'
import { Button } from '@/components/ui/button'

type Cancha = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  ubicacion: string
  precio: number
  propietario_id: string
}

type Reserva = {
  id: number
  cancha_id: number
  fecha: string
  nombre_cancha: string
  ubicacion: string
  capacidad: number
  puntuacion: number
  comentario: string
  user_id: string
  nombreCompleto?: string
}

export function ReservasCanchasComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [arrendatarioId, setArrendatarioId] = useState<string | null>(null);
  const [reseñaModalOpen, setReseñaModalOpen] = useState(false)
  const [reseñaSeleccionada, setReseñaSeleccionada] = useState<Reserva | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setArrendatarioId(session?.user?.id || null);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (arrendatarioId) {
        const { data: canchasData, error: canchasError } = await supabase
          .from('canchas')
          .select('*')
          .eq('propietario_id', arrendatarioId);
    
        if (canchasError) {
          console.error('Error fetching canchas:', canchasError);
        } else {
          setCanchas(canchasData);
        }
    
        const { data: reservasData, error: reservasError } = await supabase
          .from('reservas')
          .select('*');
    
        if (reservasError) {
          console.error('Error fetching reservas:', reservasError);
        } else {
          const reservasConNombre = await Promise.all(reservasData.map(async (reserva) => {
            try {
              const nombreCompleto = await getUserFullName(reserva.user_id) || 'Desconocido';
              console.log(`Nombre completo para el user_id ${reserva.user_id}: ${nombreCompleto}`);
              return { ...reserva, nombreCompleto };
            } catch (error) {
              console.error(`Error al obtener el nombre completo para user_id ${reserva.user_id}:`, error);
              return { ...reserva, nombreCompleto: 'Desconocido' };
            }
          }));
          setReservas(reservasConNombre);
        }
      }
    };

    fetchData()
  }, [arrendatarioId])

  const filteredCanchas = canchas.filter(cancha =>
    cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancha.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReservasForCancha = (canchaId: number) =>
    reservas.filter(reserva => reserva.cancha_id === canchaId);

  const openReseñaModal = (reserva: Reserva) => {
    setReseñaSeleccionada(reserva)
    setReseñaModalOpen(true)
  }

  const closeReseñaModal = () => {
    setReseñaModalOpen(false)
    setReseñaSeleccionada(null)
  }


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Reservas de Canchas</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar canchas"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-8 bg-blanco">
        {filteredCanchas.map((cancha) => (
          <div key={cancha.id} className="bg-blanco shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{cancha.nombre}</h2>
                <Badge>{cancha.tipo}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{cancha.ubicacion}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Capacidad: {cancha.capacidad}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Precio: ${cancha.precio}/hora</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Reservas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre de Cancha</TableHead>
                    <TableHead>Arrendado por</TableHead>
                    <TableHead>Reseñas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getReservasForCancha(cancha.id).map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <Calendar className="inline mr-2 h-4 w-4" />
                        {new Date(reserva.fecha).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reserva.nombre_cancha}</TableCell>
                      <TableCell>{reserva.nombreCompleto}</TableCell>
                      <TableCell className=''>
                        <Button type="submit" onClick={() => openReseñaModal(reserva)}>Ver reseña</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Total de reservas: {getReservasForCancha(cancha.id).length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reseñaModalOpen && reseñaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-celeste-claro bg-opacity-60 z-50">
        <div className="bg-blanco p-8 rounded-lg shadow-xl w-96 max-w-md">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Reseña</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-medium"><strong>Nombre:</strong> {reseñaSeleccionada.nombreCompleto}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium"><strong>Estrellas:</strong> 
                <span className="text-amarillo">{"★".repeat(reseñaSeleccionada.puntuacion)}</span>
                {"★".repeat(5 - reseñaSeleccionada.puntuacion).split("").map((_, i) => <span key={i} className="text-gray-300">★</span>)}
              </p>
            </div>
            <div>
              <p className="text-gray-700 font-medium"><strong>Comentario:</strong> {reseñaSeleccionada.comentario}</p>
            </div>
          </div>
      
          <button
            className="mt-6 bg-rojo text-blanco p-3 rounded-md w-full text-lg font-semibold hover:bg-rojo-dark transition-all"
            onClick={closeReseñaModal}
          >
            Cerrar
          </button>
        </div>
      </div>
      
      )}
    </div>
  )
}
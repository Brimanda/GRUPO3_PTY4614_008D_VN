'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, PlusCircle, MapPin, Users, DollarSign, Edit, Trash } from 'lucide-react'
import { deleteCancha, getCanchasPorPropietario } from "@/app/lib/canchas"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CanchasDisponiblesComponent() {
  const [canchas, setCanchas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchCanchas() {
      try {
        const data = await getCanchasPorPropietario()
        setCanchas(data)
      } catch (error) {
        setError("Error al cargar las canchas.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCanchas()
  }, [])

  const handleDelete = async (canchaId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cancha?")) {
      try {
        await deleteCancha(canchaId)
        setCanchas(canchas.filter((cancha) => cancha.id !== canchaId))
      } catch (error) {
        setError("Error al eliminar la cancha.")
      }
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 rounded-lg shadow-lg bg-gradient-to-br from-celeste-claro to-azul">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blanco">Canchas Disponibles</h1>
        <Link href="/dashboard/canchas/create">
          <Button className="bg-azul text-blanco">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Canchas
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar canchas" className="pl-10 bg-white text-gray-800 border-none" />
        </div>
      </div>

      {isLoading ? ( 
        <p className="text-center text-white">Cargando canchas....</p>
      ) : error ? ( 
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="bg-sky-300 bg-opacity-50 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-celeste-claro bg-opacity-70">
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Tipo</TableHead>
                <TableHead className="text-white">Disponibilidad</TableHead>
                <TableHead className="text-white">Capacidad</TableHead>
                <TableHead className="text-white">Ubicación</TableHead>
                <TableHead className="text-white">Precio</TableHead>
                <TableHead className="text-white">Acciones</TableHead> 
              </TableRow>
            </TableHeader>
            <TableBody>
              {canchas.map((cancha) => (
                <TableRow key={cancha.id} className="hover:bg-celeste-claro hover:bg-opacity-50">
                  <TableCell className="text-blanco">{cancha.id}</TableCell>
                  <TableCell className="font-medium text-blanco">{cancha.nombre}</TableCell>
                  <TableCell className="text-blanco">{cancha.tipo}</TableCell>
                  <TableCell>
                    <Badge variant={cancha.disponibilidad ? "default" : "destructive"} className={cancha.disponibilidad ? "bg-verde-claro text-blanco" : "bg-rojo text-blanco"}>
                      {cancha.disponibilidad ? "Disponible" : "No Disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blanco">
                    <Users className="inline mr-2 h-4 w-4" />
                    {cancha.capacidad}
                  </TableCell>
                  <TableCell className="text-blanco">
                    <MapPin className="inline mr-2 h-4 w-4" />
                    {cancha.ubicacion}
                  </TableCell>
                  <TableCell className="text-blanco">
                    <DollarSign className="inline mr-2 h-4 w-4" />
                    {cancha.precio}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/canchas/edit/${cancha.id}`}>
                        <Button variant="outline" className="bg-verde-claro text-blanco">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" onClick={() => handleDelete(cancha.id)} className="bg-rojo">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="text-blanco hover:text-blue-200" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="text-blanco hover:text-blue-200">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive className="bg-blue-700 text-blanco">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="text-blanco hover:text-blue-200">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="text-blanco" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" className="text-blanco hover:text-blue-200" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
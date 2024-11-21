'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XIcon } from 'lucide-react'
import { getCanchaById, updateCancha } from '@/app/lib/canchas'
import { Cancha } from '@/app/types'
import { supabase } from '@/app/lib/supabase'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const supabaseStorageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/canchas/"

export function EditCanchaComponent() {
  const router = useRouter()
  const params = useParams()
  const canchaId = Number(params.canchaId)
  const [cancha, setCancha] = useState<Cancha | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchCanchas() {
      try {
        const data = await getCanchaById(canchaId)
        setCancha(data)
      } catch (err) {
        console.error("Error encontrando datos de canchas:", err)
        setError("Error al cargar la cancha deportiva.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCanchas()
  }, [canchaId])

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCancha(prevCancha => prevCancha ? { ...prevCancha, nombre: e.target.value } : prevCancha)
  }

  const handleTipoChange = (value: string) => {
    setCancha(prevCancha => prevCancha ? { ...prevCancha, tipo: value } : prevCancha)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCancha(prevCancha => prevCancha ? { ...prevCancha, precio: Number(e.target.value) } : prevCancha)
  }

  const handleAvailabilityChange = (checked: boolean) => {
    setCancha(prevCancha => prevCancha ? { ...prevCancha, disponibilidad: checked } : prevCancha)
  }

  const handleSaveChanges = async () => {
    if (cancha) {
      setIsLoading(true)
      setError(null)

      try {
        await updateCancha(cancha.id, cancha)
        alert("Cancha deportiva actualizada con éxito.")
        router.push("/dashboard/canchas")
      } catch (error) {
        console.error("Error al actualizar la cancha deportiva:", error)
        setError("Error al actualizar la cancha deportiva.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg bg-gradient-to-br from-celeste-claro to-azul">
        <h1 className="text-2xl font-bold mb-6">Editar Cancha Deportiva</h1>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-blanco">Nombre de la Cancha</Label>
            <Input
              id="name"
              value={cancha?.nombre || ""}
              onChange={handleNombreChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="selectTipo" className="text-blanco">Tipo de Cancha</Label>
            <Select
              value={cancha?.tipo || ""}
              onValueChange={handleTipoChange}
              disabled={!isEditing}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de cancha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="futbol">Fútbol</SelectItem>
                <SelectItem value="tenis">Tenis</SelectItem>
                <SelectItem value="basquet">Básquet</SelectItem>
                <SelectItem value="voley">Vóley</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price" className="text-blanco">Precio por Hora</Label>
            <Input
              id="price"
              type="number"
              value={cancha?.precio || ""}
              onChange={handlePriceChange}
              disabled={!isEditing}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={cancha?.disponibilidad || false}
              onCheckedChange={handleAvailabilityChange}
              disabled={!isEditing}
            />
            <Label htmlFor="isAvailable" className="text-blanco">Disponible para Reservas</Label>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <Button variant="outline" className="bg-rojo text-blanco" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges}>
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

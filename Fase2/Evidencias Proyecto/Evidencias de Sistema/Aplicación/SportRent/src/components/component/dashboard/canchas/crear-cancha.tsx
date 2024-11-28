'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation";
import { MapPin, Users, DollarSign, Image } from "lucide-react"
import { supabase } from "@/app/lib/supabase";
import { createCancha } from "@/app/lib/canchas";

export function CrearCanchaComponent() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [precio, setPrecio] = useState("");
  const [disponibilidad, setDisponibilidad] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); 

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const supabaseStorageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id); 
      } else {
        setError("No se ha encontrado un usuario autenticado.");
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("No se ha podido obtener el ID del usuario.");
      return;
    }

    try {
      if (!nombre || !tipo || !capacidad || !ubicacion || !precio) {
        setError("No haz llenado todos los campos correspondientes.");
        return;
      }

      const imageUrls = await Promise.all(
        (imageFiles ? Array.from(imageFiles) : []).map(async (file) => {
          if (!file) {
            throw new Error("No se ha seleccionado una imagen válida");
          }
          const { data, error } = await supabase.storage
            .from("canchas")
            .upload(`${Math.random()}-${file.name}`.replace(/\s/g, ""), file);

          if (error) {
            throw new Error("Error al subir la imagen: " + error.message);
          }

          if (data) {
            const publicUrl = `${supabaseStorageUrl}/canchas/${data.path}`;
            return publicUrl;
          } else {
            throw new Error("Error inesperado al subir la imagen");
          }
        })
      );

      const newCancha = {
        nombre,
        tipo,
        capacidad,
        ubicacion,
        precio, 
        disponibilidad,
        imagen: imageUrls, 
        propietario_id: userId, 
        created_at: new Date().toISOString()
      };

      await createCancha(newCancha);

      router.push("/dashboard/canchas");
    } catch (error: any) {
      console.error("Error al crear la cancha:", error);
      setError(error.message || "Error al crear la cancha.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/canchas"); 
  };

  return (
    <div className="container mx-auto py-10">
      <div className="border rounded-lg p-6 shadow-md bg-gradient-to-br from-celeste-claro to-azul">
        <h1 className="text-2xl font-bold mb-6 text-blanco">Crear Nueva Cancha</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-blanco">Nombre de la Cancha</Label>
              <Input id="nombre" value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Cancha Principal" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-blanco">Tipo de Cancha</Label>
              <Select required onValueChange={(value) => setTipo(value)}>
                <SelectTrigger id="tipo">
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

            <div className="space-y-2">
              <Label htmlFor="capacidad" className="text-blanco">Capacidad</Label>
              <div className="relative">
                <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="capacidad" value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  type="number" className="pl-8" placeholder="Número de jugadores" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ubicacion" className="text-blanco">Ubicación</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="ubicacion" value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="pl-8" placeholder="Ej: Zona Norte" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio" className="text-blanco">Precio por Hora</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="precio" value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  type="number" className="pl-8" placeholder="Precio en $" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="disponibilidad" className="text-blanco">Disponibilidad</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disponibilidad"
                  checked={disponibilidad}
                  onCheckedChange={setDisponibilidad}
                />
                <Label htmlFor="disponibilidad">
                  {disponibilidad ? "Disponible" : "No Disponible"}
                </Label>
              </div>
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="imagen" className="text-blanco">Imagen de la Cancha</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <Image className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  multiple
                  />
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">Crear Cancha</Button>
        </form>
      </div>
    </div>
  )
}

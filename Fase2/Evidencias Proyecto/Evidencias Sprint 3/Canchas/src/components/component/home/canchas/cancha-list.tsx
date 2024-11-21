'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/component/auth/AuthProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { CalendarIcon, MapPinIcon, Star, UsersIcon } from "lucide-react";
import Image from "next/image";
import { getCanchas, getPromedioYTotalPuntuacion } from "@/app/lib/canchas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Rating from '@mui/material/Rating';

const tiposDeporte = ["futbol", "tenis", "basquet", "voley"];

export function CanchasDeportivas() {
  const { session, isLoading } = useAuth();
  const [canchas, setCanchas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtrosDeporte, setFiltrosDeporte] = useState<string[]>([]);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("todas");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState(0);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [filtroCapacidadMin, setFiltroCapacidadMin] = useState(0);
  const [filtroLugar, setFiltroLugar] = useState<string>("todas");
  const router = useRouter();

  const ubicaciones = ["VIÑA DEL MAR", "SANTIAGO", "QUILPUE", "BELLOTO", "VILLA ALEMANA"];
  const API_KEY = "65fa3bb168604c139358abbb88d50842";

  const toggleFiltroDeporte = (deporte: string) => {
    setFiltrosDeporte(prev =>
      prev.includes(deporte)
        ? prev.filter(d => d !== deporte)
        : [...prev, deporte]
    );
  };

  const canchasFiltradas = canchas.filter((cancha) => {
    return (
      (filtrosDeporte.length === 0 || filtrosDeporte.includes(cancha.tipo)) &&
      (filtroDisponibilidad === "todas" ||
        (filtroDisponibilidad === "disponibles" && cancha.disponible) ||
        (filtroDisponibilidad === "no disponibles" && !cancha.disponible)) &&
      (filtroLugar === "todas" || cancha.ubicacion === filtroLugar) &&
      cancha.precio <= filtroPrecioMax &&
      cancha.capacidad >= filtroCapacidadMin
    );
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const canchaData = await getCanchas();

        const canchasConPuntuacion = await Promise.all(
          canchaData.map(async (cancha: any) => {
            const { promedio, total } = await getPromedioYTotalPuntuacion(cancha.id);
            return { ...cancha, puntuacionPromedio: promedio, total_puntuaciones: total };
          })
        );

        setCanchas(canchasConPuntuacion);
      } catch (err) {
        setError("Error al cargar los datos.");
      }
    }
    fetchData();
  }, []);

  const handleLocation = async (latitude: number, longitude: number) => {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`);
    const data = await response.json();

    const results = data.results;
    if (results.length > 0) {
      const city = results[0].components.city || results[0].components.town || results[0].components.village || results[0].components.hamlet;
      setUserLocation(city ? city.toUpperCase() : null);
      setFiltroLugar(city ? city.toUpperCase() : "todas");
    } else {
      console.warn("No se encontraron resultados para la ubicación.");
    }
  };

  useEffect(() => {
    const obtenerUbicacion = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleLocation(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
          }
        );
      } else {
        console.warn("Geolocalización no está soportada en este navegador.");
      }
    };

    obtenerUbicacion();
  }, []);
  

  const handleReservar = (cancha: any) => {
    const userId = session?.user?.id;
    if (!userId) {
      alert("Debes estar autenticado para reservar.");
      return;
    }
    const queryParams = new URLSearchParams({
      nombre: cancha.nombre,
      tipo: cancha.tipo,
      capacidad: cancha.capacidad.toString(),
      ubicacion: cancha.ubicacion,
      imagen: cancha.imagen,
      precio: cancha.precio.toString(),
      disponibilidad: cancha.disponibilidad.toString(),
      cancha_id: cancha.id.toString(),
      user_id: userId
    });
    router.push(`/pagar?${queryParams.toString()}`);
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Canchas Deportivas</h1>
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {tiposDeporte.map((deporte) => (
              <Toggle
                key={deporte}
                pressed={filtrosDeporte.includes(deporte)}
                onPressedChange={() => toggleFiltroDeporte(deporte)}
                className="capitalize"
              >
                {deporte}
              </Toggle>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-col w-36">
              <Select value={filtroDisponibilidad} onValueChange={setFiltroDisponibilidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="disponibles">Disponibles</SelectItem>
                  <SelectItem value="no disponibles">No disponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-36">
              <Select value={filtroLugar} onValueChange={setFiltroLugar}>
                <SelectTrigger>
                  <SelectValue placeholder="Lugar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {ubicaciones.map((ubicacion) => (
                    <SelectItem key={ubicacion} value={ubicacion}>
                      {ubicacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-48">
              <label htmlFor="precio-max" className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo: ${filtroPrecioMax}
              </label>
              <Slider
                id="precio-max"
                min={0}
                max={100000}
                step={5000}
                value={[filtroPrecioMax]}
                onValueChange={(value) => setFiltroPrecioMax(value[0])}
              />
            </div>
            <div className="flex flex-col w-32">
              <label htmlFor="capacidad-min" className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad mínima: {filtroCapacidadMin}
              </label>
              <Slider
                id="capacidad-min"
                min={0}
                max={25}
                step={1}
                value={[filtroCapacidadMin]}
                onValueChange={(value) => setFiltroCapacidadMin(value[0])}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : canchasFiltradas.length === 0 ? (
            <p>No se encontraron canchas.</p>
          ) : (
            canchasFiltradas.map((cancha) => (
              <Card key={cancha.id} className="bg-gradient-to-r from-celeste-claro to-azul shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:scale-105 border border-sky-200">
                <CardHeader className="bg-gradient-to-r from-celeste-claro to-azul p-6 text-blanco">
                  <CardTitle className="text-2xl font-bold">{cancha.nombre}</CardTitle>
                  <CardDescription className="text-lg mt-2 text-blanco">{cancha.tipo}</CardDescription>
                  <div className="flex items-center mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(cancha.puntuacionPromedio) ? "text-amarillo fill-amarillo" : "text-sky-200"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-blanco">
                      {cancha.puntuacionPromedio.toFixed(1)} ({cancha.total_puntuaciones} valoraciones)
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={cancha.imagen[0] || "/placeholder.svg"}
                      alt={cancha.nombre}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2 text-blanco">
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Ubicación:</span>
                      <span>{cancha.ubicacion}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Capacidad:</span>
                      <span>{cancha.capacidad} personas</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Precio:</span>
                      <span>${cancha.precio}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Disponibilidad:</span>
                      <span className={cancha.disponible ? "text-rojo" : "text-verde-claro"}>
                        {cancha.disponible ? "No Disponible" : "Disponible"}
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-sky-100">
                  <Button
                    onClick={() => handleReservar(cancha)}
                    className="w-full bg-blanco hover:bg-blanco text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300"
                  >
                    Reservar
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

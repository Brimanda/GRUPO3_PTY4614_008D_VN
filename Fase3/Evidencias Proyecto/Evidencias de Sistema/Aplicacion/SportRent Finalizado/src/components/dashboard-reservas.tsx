'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { supabase } from '@/app/lib/supabase'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DashboardReservasComponent() {
  const [totalReservas, setTotalReservas] = useState(0)
  const [reservasPorMes, setReservasPorMes] = useState<{ name: string; reservas: number }[]>([])
  const [ultimasReservas, setUltimasReservas] = useState<{ id: number; fecha: string; nombre_cancha: string; capacidad: number; estado: string; }[]>([])
  const [canchasData, setCanchasData] = useState<{ nombre: string; reservas: number; ingresos: number; capacidad: number }[]>([])
  const [tiposCanchasData, setTiposCanchasData] = useState<{ name: string; value: number }[]>([])
  const [arrendatarioId, setArrendatarioId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setArrendatarioId(session?.user?.id || null);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: totalData, error: totalError } = await supabase
        .from('reservas')
        .select('*', { count: 'exact' });
      if (totalError) console.error(totalError);
      if (totalData) {
        setTotalReservas(totalData.length);
      }


      const { data: canchaData, error: canchaError } = await supabase
        .from('canchas')
        .select('id, nombre')
        .eq('propietario_id', arrendatarioId);

      if (canchaError) {
        console.error('Error al obtener las canchas:', canchaError);
        return;
      }

      const canchaIds = canchaData.map(cancha => cancha.id);

      const { data: reservasMesData, error: reservasMesError } = await supabase
        .from('reservas')
        .select('id, fecha, cancha_id')
        .in('cancha_id', canchaIds) 
        .order('fecha', { ascending: true });

      if (reservasMesError) {
        console.error(reservasMesError);
        return;
      }

      if (reservasMesData) {
        const reservasPorMes = reservasMesData.reduce((acc: { [key: string]: number }, reserva) => {
          const mes = new Date(reserva.fecha).toLocaleString('default', { month: 'short' });
          acc[mes] = (acc[mes] || 0) + 1;
          return acc;
        }, {});

        setReservasPorMes(Object.keys(reservasPorMes).map((mes) => ({
          name: mes,
          reservas: reservasPorMes[mes],
        })));
      }
      const { data: ultimasReservasData, error: ultimasReservasError } = await supabase
        .from('reservas')
        .select('id, fecha, nombre_cancha, capacidad, estado, cancha_id')
        .in('cancha_id', canchaIds)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ultimasReservasError) {
        console.error('Error al obtener las últimas reservas:', ultimasReservasError);
        return;
      }

      if (ultimasReservasData) {
        const reservasConNombres = ultimasReservasData.map(reserva => {
          const cancha = canchaData.find(cancha => cancha.id === reserva.cancha_id);
          return {
            ...reserva,
            nombre_cancha: cancha?.nombre || 'Desconocida',
          };
        });
        setUltimasReservas(reservasConNombres); 
      }


      const { data: canchasData, error: canchasError } = await supabase
        .from('canchas')
        .select('id, nombre, capacidad, precio, tipo')
        .eq('propietario_id', arrendatarioId);

      if (canchasError) {
        console.error('Error al obtener las canchas:', canchasError);
        return;
      }

      if (canchasData) {
        const canchaIds = canchasData.map((cancha) => cancha.id);

        const { data: reservasData, error: reservasError } = await supabase
          .from('reservas')
          .select('cancha_id')
          .in('cancha_id', canchaIds);

        if (reservasError) {
          console.error('Error al obtener las reservas:', reservasError);
          return;
        }

        const { data: pagosData, error: pagosError } = await supabase
          .from('pagos')
          .select('canchanombre, total');

        if (pagosError) {
          console.error('Error al obtener los pagos:', pagosError);
          return;
        }

        const processedData = canchasData.map((cancha) => {
          const reservasCount = reservasData.filter(
            (reserva) => reserva.cancha_id === cancha.id
          ).length;

          const ingresosTotales = pagosData
            .filter((pago) => pago.canchanombre === cancha.nombre)
            .reduce((acc, pago) => acc + parseFloat(pago.total), 0);

          return {
            nombre: cancha.nombre,
            reservas: reservasCount,
            ingresos: ingresosTotales,
            capacidad: cancha.capacidad,
            tipo: cancha.tipo
          };
        });

        setCanchasData(processedData);

        const { data: reservaData, error: reservaError } = await supabase
          .from('reservas')
          .select('cancha_id, canchas!inner(tipo)')
          .in('cancha_id', canchaIds);

        if (reservaError) {
          console.error('Error al obtener las reservas:', reservasError);
          return;
        }

        if (reservaData) {
          const tiposContados = reservasData.reduce((acc: { [key: string]: number }, reserva) => {
            const cancha = canchasData.find(c => c.id === reserva.cancha_id);
            const tipo = cancha?.tipo;

            if (tipo) {
              acc[tipo] = (acc[tipo] || 0) + 1;
            }
            return acc;
          }, {});

          const formattedData = Object.entries(tiposContados).map(([name, value]) => ({
            name,
            value,
          }));

          setTiposCanchasData(formattedData);
        }
      }
    }

    fetchData();
  }, [arrendatarioId]);

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-verde-claro"
      case "pendiente":
        return "bg-amarillo"
      case "cancelada":
        return "bg-rojo"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Reservas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservas}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reservas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reservasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reservas" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reservas por Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={canchasData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reservas" fill="#30bae9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ingresos por Cancha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={canchasData}
                    dataKey="ingresos"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {canchasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tipos de Canchas más solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tiposCanchasData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {tiposCanchasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Reservas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Fecha</TableHead>
                <TableHead className="whitespace-nowrap">Lugar</TableHead>
                <TableHead className="whitespace-nowrap">Capacidad</TableHead>
                <TableHead className="whitespace-nowrap">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimasReservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(reserva.fecha).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {reserva.nombre_cancha}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {reserva.capacidad}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className={`${getBadgeColor(reserva.estado)} text-white`}>
                      {reserva.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

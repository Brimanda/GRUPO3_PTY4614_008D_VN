'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon, TrendingUpIcon, ClockIcon, CheckCircleIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '@/app/lib/supabase'

export function DashboardReservasComponent() {
  const [totalReservas, setTotalReservas] = useState(0)
  const [reservasPorMes, setReservasPorMes] = useState<{ name: string; reservas: number }[]>([])
  const [ultimasReservas, setUltimasReservas] = useState<{ id: number; fecha: string; nombre_cancha: string; capacidad: number; estado: string; }[]>([])

  useEffect(() => {
    async function fetchReservas() {
      const { data: totalData, error: totalError } = await supabase
        .from('reservas')
        .select('*', { count: 'exact' })
      if (totalError) console.error(totalError)
      if (totalData) {
        setTotalReservas(totalData.length)
      }

      const { data: reservasMesData, error: reservasMesError } = await supabase
        .from('reservas')
        .select('id, fecha')
        .order('fecha', { ascending: true })
      if (reservasMesError) console.error(reservasMesError)

      if (reservasMesData) {
        const reservasPorMes = reservasMesData.reduce((acc: { [key: string]: number }, reserva) => {
          const mes = new Date(reserva.fecha).toLocaleString('default', { month: 'short' })
          acc[mes] = (acc[mes] || 0) + 1
          return acc
        }, {})
        const reservasMesArray = Object.keys(reservasPorMes).map((mes) => ({
          name: mes,
          reservas: reservasPorMes[mes],
        }))
        setReservasPorMes(reservasMesArray)
      }

      const { data: ultimasReservasData, error: ultimasReservasError } = await supabase
        .from('reservas')
        .select('id, fecha, nombre_cancha, capacidad, estado')
        .order('created_at', { ascending: false })
        .limit(5)
      if (ultimasReservasError) console.error(ultimasReservasError)
      if (ultimasReservasData) {
        setUltimasReservas(ultimasReservasData)
      }
    }

    fetchReservas()
  }, [])

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
      <h1 className="text-3xl font-bold mb-6">Reservas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservas por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reservas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Lugar</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimasReservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(reserva.fecha).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {reserva.nombre_cancha}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {reserva.capacidad}
                    </div>
                  </TableCell>
                  <TableCell>
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

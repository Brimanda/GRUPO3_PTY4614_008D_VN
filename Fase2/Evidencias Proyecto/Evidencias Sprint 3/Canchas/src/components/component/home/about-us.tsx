"use client"

import { useState, useEffect } from 'react'
import { Users, Target, Award, Heart, MapPin, Calendar, CreditCard, Smile } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function AboutUsComponent() {
  const [stats, setStats] = useState({ propietarios: 0, usuarios: 0, reservas: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        propietarios: Math.min(prevStats.propietarios + 1, 500),
        usuarios: Math.min(prevStats.usuarios + 100, 10000),
        reservas: Math.min(prevStats.reservas + 50, 50000)
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-[#f0f9fd] to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-[#30bae9]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre SportRent
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold flex items-center text-[#30bae9]">
                  <Users className="mr-2" />
                  Nuestra Misión
                </h3>
                <p className="text-gray-700">
                Facilitar el proceso de búsqueda y reserva de canchas deportivas de fútbol, pádel y baloncesto a través de una plataforma intuitiva, que conecta a arrendatarios con propietarios de canchas, brindando una experiencia confiable y eficiente. Nuestra plataforma busca simplificar la gestión de reservas, maximizando el uso de las instalaciones deportivas y promoviendo el deporte y la actividad física en las comunidades.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold flex items-center text-[#30bae9]">
                  <Target className="mr-2" />
                  Nuestro Objetivo
                </h3>
                <p className="text-gray-700">
                  Ser la plataforma líder en la conexión entre propietarios de canchas y deportistas, ofreciendo una experiencia de reserva sencilla, segura y eficiente para ambas partes.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold flex items-center text-[#30bae9]">
                  <Award className="mr-2" />
                  Nuestra Visión
                </h3>
                <p className="text-gray-700">
                Ser la plataforma líder en la gestión de reservas de canchas deportivas, ofreciendo una experiencia ágil y eficiente tanto para los usuarios que buscan arrendar espacios, como para los propietarios de las canchas. Queremos ser reconocidos por mejorar el acceso y la organización del deporte amateur, fomentando la actividad física y el uso eficiente de instalaciones deportivas.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold flex items-center text-[#30bae9]">
                  <Heart className="mr-2" />
                  Nuestros Valores
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Transparencia en todas las transacciones</li>
                  <li>Excelencia en el servicio al cliente</li>
                  <li>Innovación continua en la gestión de reservas</li>
                  <li>Compromiso con el desarrollo deportivo local</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-[#30bae9]">Nuestro Impacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(stats).map(([key, value]) => (
              <Card key={key} className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <h4 className="text-4xl font-bold text-[#30bae9] mb-2">{value.toLocaleString()}</h4>
                  <p className="text-gray-700 capitalize">{key}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-8 text-[#30bae9]">Beneficios de SportRent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-2xl font-semibold mb-4 text-[#30bae9]">Para Propietarios</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Aumente la visibilidad de sus instalaciones deportivas</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Gestione fácilmente las reservas y la disponibilidad</span>
                  </li>
                  <li className="flex items-start">
                    <CreditCard className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Reciba pagos de forma segura y puntual</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-[#30bae9] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-2xl font-semibold mb-4 text-[#30bae9]">Para Usuarios</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Encuentre y reserve canchas deportivas cerca de usted</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Reserve en cualquier momento, las 24 horas del día</span>
                  </li>
                  <li className="flex items-start">
                    <Smile className="w-5 h-5 mr-2 text-[#30bae9] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Disfrute de una amplia variedad de deportes y ubicaciones</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
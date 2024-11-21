'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'

export function HeroSectionComponent() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    '/canchababy.jpg?height=860&width=1920&text=Fútbol',
    '/canchabasket.jpg?height=860&width=1920&text=Basket',
    '/canchavoleyplaya.jpg?height=860&width=1920&text=Voley',
    '/padel2.jpg?height=860&width=1920&text=Padel'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Cancha de ${['fútbol', 'tenis', 'básquetbol'][index]}`}
          layout="fill"
          objectFit="cover"
          className={`transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 opacity-80 bg-negro backdrop-blur-2xl ">
        <div className="container mx-auto h-full flex flex-col justify-center items-start text-blanco p-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
          >
            Tu Cancha, Tu Juego
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-4xl font-semibold mb-6"
          >
            Reserva Fácil, Juega Duro
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-2xl"
          >
            Desde canchas de fútbol hasta pistas de tenis, ofrecemos los mejores espacios para tus actividades deportivas. Reserva ahora y vive la emoción del deporte en instalaciones de primera calidad.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <FeatureCard icon={<Calendar className="w-6 h-6" />} text="Reserva 24/7" />
            <FeatureCard icon={<MapPin className="w-6 h-6" />} text="Múltiples ubicaciones" />
            <FeatureCard icon={<Users className="w-6 h-6" />} text="Para todos los niveles" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center bg-white bg-opacity-10 rounded-full py-2 px-4">
      {icon}
      <span className="ml-2 text-sm md:text-base">{text}</span>
    </div>
  )
}
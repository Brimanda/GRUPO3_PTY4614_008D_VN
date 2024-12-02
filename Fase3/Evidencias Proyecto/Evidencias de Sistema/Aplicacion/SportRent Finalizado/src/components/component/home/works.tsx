import React from 'react'
import { Search, Calendar, Dumbbell, DollarSign } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { icon: Search, title: 'Busca', description: 'Encuentra la cancha perfecta para tu deporte favorito.' },
  { icon: Calendar, title: 'Reserva', description: 'Elige la fecha y hora que más te convenga.' },
  { icon: Dumbbell, title: 'Juega', description: 'Disfruta de tu actividad deportiva.' },
  { icon: DollarSign, title: 'Gana', description: 'Para propietarios: recibe pagos por tus reservas.' },
]

const WorksComponent = () => {
  return (
    <section className="py-16 bg-blanco">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-negro">Cómo funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-blanco rounded-lg shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-[#30bae9] opacity-20 rounded-full"></div>
                    <div className="relative z-10 bg-[#30bae9] rounded-full p-4">
                      <step.icon className="text-white" size={32} />
                    </div>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-[#eeca06] rounded-full w-8 h-8 flex items-center justify-center text-[#2271b3] font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2271b3]">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorksComponent
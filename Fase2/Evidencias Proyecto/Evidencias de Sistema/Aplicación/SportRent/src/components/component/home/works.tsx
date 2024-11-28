import React from 'react'
import { Search, Calendar, Dumbbell, DollarSign } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Busca', description: 'Encuentra la cancha perfecta para tu deporte favorito.' },
  { icon: Calendar, title: 'Reserva', description: 'Elige la fecha y hora que más te convenga.' },
  { icon: Dumbbell, title: 'Juega', description: 'Disfruta de tu actividad deportiva.' },
  { icon: DollarSign, title: 'Gana', description: 'Para propietarios: recibe pagos por tus reservas.' },
]

const WorksComponent = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Cómo funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full p-6 inline-block mb-4">
                <step.icon className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorksComponent
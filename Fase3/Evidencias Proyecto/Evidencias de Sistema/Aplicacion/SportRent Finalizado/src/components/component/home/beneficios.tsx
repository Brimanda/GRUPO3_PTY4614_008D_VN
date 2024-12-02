import React from 'react'
import { Shield, TrendingUp, Users, Clock } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  { icon: Shield, title: 'Seguridad garantizada', description: 'Verificamos a todos los usuarios y ofrecemos seguro para las propiedades.' },
  { icon: TrendingUp, title: 'Optimización', description: 'Para propietarios: maximiza la ocupación. Para usuarios: encuentra las mejores ofertas.' },
  { icon: Users, title: 'Comunidad deportiva', description: 'Conecta con otros deportistas y amplía tu red.' },
  { icon: Clock, title: 'Ahorro de tiempo', description: 'Reservas y pagos automatizados para una experiencia sin complicaciones.' },
]

const Beneficios = () => {
  return (
    <section className="py-16 bg-blanco">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-negro">Beneficios para todos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-blanco rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 p-3 bg-celeste-claro rounded-full">
                    <benefit.icon className="text-blanco" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-azul">{benefit.title}</h3>
                  <p className="text-gray-600 text-center">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Beneficios

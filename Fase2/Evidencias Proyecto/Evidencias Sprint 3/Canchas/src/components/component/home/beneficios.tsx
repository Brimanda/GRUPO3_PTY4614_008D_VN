import React from 'react'
import { Shield, TrendingUp, Users, Clock } from 'lucide-react'

const benefits = [
  { icon: Shield, title: 'Seguridad garantizada', description: 'Verificamos a todos los usuarios y ofrecemos seguro para las propiedades.' },
  { icon: TrendingUp, title: 'Optimización', description: 'Para propietarios: maximiza la ocupación. Para usuarios: encuentra las mejores ofertas.' },
  { icon: Users, title: 'Comunidad deportiva', description: 'Conecta con otros deportistas y amplía tu red.' },
  { icon: Clock, title: 'Ahorro de tiempo', description: 'Reservas y pagos automatizados para una experiencia sin complicaciones.' },
]

const Beneficios = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Beneficios para todos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <benefit.icon className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Beneficios
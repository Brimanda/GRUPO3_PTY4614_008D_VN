import React from 'react'

const propertyTypes = [
  { name: 'Cancha de Fútbol', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Cancha de Baloncesto', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Cancha de Tenis', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Cancha de Vóley', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
]

const PropertyTypes = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Descubre nuestras canchas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {propertyTypes.map((type, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition duration-300 transform hover:scale-105">
              <img src={type.image} alt={type.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center">{type.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PropertyTypes
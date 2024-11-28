'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin } from 'lucide-react'

export function ContactComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),  
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error('Error al enviar el correo:', err)
      setError('Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row">
          <div className="bg-sky-100 p-8 md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Phone className="w-6 h-6 mr-4 text-sky-600" />
                <span>+569 87291028</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Mail className="w-6 h-6 mr-4 text-sky-600" />
                <span>info@sportrent.com</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <MapPin className="w-6 h-6 mr-4 text-sky-600" />
                <span>Calle Principal 123, Viña del Mar</span>
              </motion.div>
            </div>
          </div>
          <div className="p-8 md:w-1/2">
            <h3 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h3>
            {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">Tu mensaje ha sido enviado exitosamente.</div>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition duration-300 ease-in-out flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
                <Send className="w-5 h-5 ml-2" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

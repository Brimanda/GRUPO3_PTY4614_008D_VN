'use client'

import Link from "next/link"

export function FooterComponent() {
  return (
    <footer className="bg-celeste-claro text-white py-6">
      <div className="container mx-auto px-4">
        <nav className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
          <Link href="/" className="hover:underline">
            INICIO
          </Link>
          <Link href="/nosotros" className="hover:underline">
            NOSOTROS
          </Link>
          <Link href="/canchas" className="hover:underline">
            CANCHAS
          </Link>
          <Link href="/contacto" className="hover:underline">
            CONTACTO
          </Link>
        </nav>
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Copyright: Sport Rent
        </div>
      </div>
    </footer>
  )
}
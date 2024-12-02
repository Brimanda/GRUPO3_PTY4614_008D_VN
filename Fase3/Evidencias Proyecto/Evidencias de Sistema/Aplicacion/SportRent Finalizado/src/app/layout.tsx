import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";
import { AuthProvider } from "@/components/component/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportRent",
  description: "Reserva canchas deportivas de fútbol, tenis, pádel y más al instante. Consulta disponibilidad, precios y asegura tu horario en pocos clics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"> 
      <body className={inter.className}> 
        <AuthProvider>
          {children}
        </AuthProvider >
      </body>
    </html>
  );
}
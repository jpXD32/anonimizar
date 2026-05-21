import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🔐 Anonimizador de Datos | Protección Local de Información',
  description: 'Herramienta profesional para anonimizar datos sensibles. 100% local, sin conexión a nube, detección inteligente con NLP.',
  keywords: 'anonimización, privacidad, datos sensibles, protección, local, seguridad',
  openGraph: {
    title: 'Anonimizador de Datos Profesional',
    description: 'Protege información confidencial de forma segura y local',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

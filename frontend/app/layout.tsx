import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anonimizador de Datos | Protección Local de Información',
  description: 'Herramienta profesional para anonimizar datos sensibles. 100% local, sin conexión a nube, detección inteligente con NLP.',
  keywords: 'anonimización, privacidad, datos sensibles, protección, local, seguridad',
  openGraph: {
    title: 'Anonimizador de Datos Profesional',
    description: 'Protege información confidencial de forma segura y local',
    type: 'website',
  },
}

const criticalCss = `
  html,body{margin:0;max-width:100%;overflow-x:hidden;background:#f8fbff;color:#020617;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  body{min-height:100vh}
  a{color:inherit;text-decoration:none}
  button{font:inherit}
  [data-app-header]{position:fixed!important;top:8px!important;left:0;right:0;z-index:50;width:100%;box-sizing:border-box}
  [data-header-surface]{box-sizing:border-box;border:1px solid rgba(207,250,254,.45);background:transparent;box-shadow:none;backdrop-filter:blur(6px)}
  html.dark [data-header-surface]{border-color:rgba(30,41,59,.45);background:transparent;box-shadow:none}
  [data-header-animate]{text-decoration:none}
  [data-header-animate] img{display:block;width:120px!important;height:128px!important;max-width:120px!important;max-height:128px!important;object-fit:fill!important}
  nav[data-header-animate]{display:flex;align-items:center;gap:6px;border-radius:16px;background:rgba(236,254,255,.42);padding:6px;box-shadow:0 16px 42px rgba(20,184,166,.1)}
  html.dark nav[data-header-animate]{border-color:rgba(51,65,85,.8);background:rgba(2,6,23,.58);box-shadow:0 18px 45px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.06)}
  nav[data-header-animate] a{display:inline-flex;align-items:center;justify-content:center;min-width:132px;border-radius:12px;padding:12px 24px;font-size:15px;font-weight:800;color:#475569}
  main{display:block;min-height:100vh}
  [data-hero-bg]{pointer-events:none}
  [data-hero-animate="title"]{font-weight:900;letter-spacing:-.02em}
  [data-hero-demo]{box-sizing:border-box}
`

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
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}


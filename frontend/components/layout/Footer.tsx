'use client'

import Link from 'next/link'
import { Shield, Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">Anonimizador</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Protección de datos confidenciales con tecnología NLP de clase mundial.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-smooth">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-smooth">
                  Documentación
                </Link>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">Seguridad</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-green-500" />
                100% Local
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-green-500" />
                Sin Cloud
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-green-500" />
                Open Source
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">Comunidad</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-smooth"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} Anonimizador de Datos. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-smooth">
                Privacidad
              </Link>
              <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-smooth">
                Términos
              </Link>
            </div>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-500 pt-4">
          <p>Hecho con ❤️ usando React, Next.js y TailwindCSS</p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Anonimizador
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Datos Seguros</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-smooth">
              Inicio
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-smooth">
              Dashboard
            </Link>
            <Link href="/help" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-smooth">
              Ayuda
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <Button
              asLink
              href="/dashboard"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Comenzar
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

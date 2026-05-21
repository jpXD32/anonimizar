'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ArrowRight, Moon, ShieldCheck, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/help', label: 'Ayuda' },
    { href: '/docs', label: 'Documentación' },
  ]

  return (
    <header className="fixed top-2 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="premium-surface-glow mx-auto max-w-6xl rounded-2xl border border-slate-200/70 bg-white/86 px-4 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/86 sm:px-5 2xl:max-w-[1800px]">
        <div className="flex h-[54px] min-w-0 items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 via-indigo-600 to-teal-500 shadow-lg shadow-primary-500/25 transition-all group-hover:-translate-y-0.5">
              <ShieldCheck className="h-5 w-5 text-white" />
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <h1 className="truncate text-base font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                Anonimizador
              </h1>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                Privacidad local
              </p>
            </div>
          </Link>

          <nav className="hidden min-w-0 items-center gap-1 rounded-xl border border-slate-200/80 bg-white/55 p-1 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/70 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'relative rounded-lg bg-primary-50 px-3.5 py-2 text-sm font-black text-primary-700 shadow-sm dark:bg-primary-950/40 dark:text-primary-300'
                      : 'rounded-lg px-3.5 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white/90 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-950/70 dark:hover:text-white'
                  }
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Button
              asLink
              href="/dashboard"
              variant="primary"
              size="sm"
              className="hidden h-9 rounded-xl px-4 shadow-xl shadow-primary-500/25 sm:inline-flex"
            >
              {pathname === '/dashboard' ? 'App abierta' : 'Abrir app'}
              {pathname !== '/dashboard' && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ArrowRight, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useHeaderGsapAnimations } from '@/hooks/useHeaderGsapAnimations'
import logo from '../../logo/logo.png'

/**
 * Renderiza el encabezado principal con navegacion y acciones globales.
 */
export function Header() {
  const headerRef = useHeaderGsapAnimations()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/help', label: 'Ayuda' },
  ]

  return (
    <header
      data-app-header
      ref={headerRef}
      className="fixed top-2 z-50 w-full px-4 sm:px-6 lg:px-8"
      style={{ position: 'fixed', top: 8, zIndex: 50, width: '100%', paddingInline: 16 }}
    >
      <div
        data-header-surface
        className="mx-auto max-w-6xl rounded-2xl border border-cyan-100/45 bg-transparent px-4 shadow-none backdrop-blur-sm dark:border-slate-800/45 dark:bg-transparent sm:px-5 2xl:max-w-[1800px]"
        style={{ maxWidth: 1800, marginInline: 'auto', borderRadius: 16, background: 'transparent' }}
      >
        <div
          className="flex h-[128px] min-w-0 items-center justify-between gap-5"
          style={{ minHeight: 128, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}
        >
          <Link
            href="/"
            data-header-animate
            className="group flex min-w-0 items-center gap-12"
            style={{ display: 'flex', alignItems: 'center', gap: 48, minWidth: 0 }}
          >
            <div
              className="relative flex h-32 w-[120px] shrink-0 items-center justify-center overflow-visible bg-transparent transition-all group-hover:-translate-y-0.5"
              style={{ width: 120, height: 128, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}
            >
              <Image
                src={logo}
                alt="Logo Anonimizador"
                width={120}
                height={128}
                sizes="120px"
                className="h-full w-full object-fill"
                style={{ width: 120, height: 128, maxWidth: 120, maxHeight: 128, objectFit: 'fill' }}
                priority
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <h1 className="truncate text-2xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                Anonimizador
              </h1>
              <p className="truncate text-base font-semibold text-slate-500 dark:text-slate-300">
                Privacidad local
              </p>
            </div>
          </Link>

          <nav data-header-animate className="hidden min-w-0 items-center gap-2 rounded-2xl border border-cyan-100/70 bg-cyan-50/35 p-2 shadow-[0_18px_45px_rgba(20,184,166,0.10),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-950/58 dark:shadow-[0_18px_45px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'relative inline-flex min-w-[132px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 via-white/80 to-indigo-50 px-7 py-3 text-base font-black text-primary-700 shadow-[0_12px_30px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-cyan-200/80 transition-transform hover:-translate-y-0.5 dark:from-slate-900 dark:via-indigo-950/78 dark:to-slate-950 dark:text-cyan-100 dark:ring-cyan-400/35 dark:shadow-[0_12px_32px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'relative inline-flex min-w-[132px] items-center justify-center rounded-xl px-7 py-3 text-base font-extrabold text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-cyan-50/70 hover:text-slate-950 hover:shadow-[0_10px_26px_rgba(20,184,166,0.10)] dark:text-slate-300 dark:hover:bg-slate-900/90 dark:hover:text-cyan-50 dark:hover:shadow-[0_10px_26px_rgba(34,211,238,0.08)]'
                  }
                >
                  {active && (
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18),transparent_62%)]" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-primary-600 via-blue-500 to-accent-600 shadow-[0_0_16px_rgba(124,58,237,0.75)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div data-header-animate className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/82 text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_36px_rgba(79,95,217,0.18)] active:scale-95 dark:border-slate-700 dark:bg-slate-950/80 dark:text-yellow-300 dark:shadow-[0_12px_30px_rgba(0,0,0,0.32)] dark:hover:bg-slate-900 dark:hover:text-yellow-200"
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
              className="hidden h-10 rounded-2xl bg-gradient-to-r from-primary-600 via-blue-600 to-accent-600 px-5 shadow-[0_16px_36px_rgba(79,95,217,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(124,58,237,0.38)] active:scale-95 sm:inline-flex"
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




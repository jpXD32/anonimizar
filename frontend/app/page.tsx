'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { InteractiveDemoPreview } from '@/components/common/InteractiveDemoPreview'
import { useHeroGsapAnimations } from '@/hooks/useHeroGsapAnimations'
import {
  ArrowRight,
  BookOpen,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const stats = [
  { value: 'Local', label: 'sin envío a nube', Icon: Lock, color: 'text-teal-600 bg-teal-50' },
  { value: 'Consistente', label: 'mismos datos, mismo alias', Icon: ShieldCheck, color: 'text-primary-600 bg-primary-50' },
  { value: 'Reversible', label: 'si guardas el mapeo', Icon: RotateCcw, color: 'text-blue-600 bg-blue-50' },
]

/**
 * Renderiza la página principal del anonimizador.
 */
export default function Home() {
  const heroRef = useHeroGsapAnimations()

  return (
    <>
      <Header />
      <main className="premium-page-bg overflow-x-hidden text-slate-950 dark:text-white">
        <section ref={heroRef} className="relative overflow-visible px-4 pb-0 pt-44 sm:px-6 lg:px-8">
          <div data-hero-bg className="absolute left-0 top-24 -z-0 h-[520px] w-[42%] opacity-60 [background-image:radial-gradient(rgba(79,95,217,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="premium-3d-stage relative z-10 mx-auto grid w-full max-w-6xl min-w-0 items-center gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] 2xl:max-w-[1800px] 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
            <div className="w-full max-w-[358px] min-w-0 sm:max-w-none">
              <div className="max-w-2xl min-w-0">
                <h1 data-hero-animate="title" className="max-w-full text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-[2.28rem] xl:text-[2.58rem] 2xl:text-[3.55rem] dark:text-white">
                  <span className="block">Anonimiza datos</span>
                  <span className="block">confidenciales</span>
                  <span className="block bg-gradient-to-r from-primary-600 via-indigo-500 to-accent-600 bg-clip-text text-transparent">
                    sin salir de tu equipo
                  </span>
                </h1>
                <p data-hero-animate="copy" className="mt-3 max-w-xl text-base leading-6 text-slate-600 sm:text-[1.02rem] 2xl:max-w-3xl 2xl:text-lg 2xl:leading-7 dark:text-slate-300">
                  Detecta nombres, RUT, correos, teléfonos y ubicaciones para reemplazarlos con valores consistentes y auditables.
                </p>
              </div>

              <div data-hero-animate="actions" className="mt-8 flex max-w-full flex-col gap-3 sm:flex-row">
                <Button
                  asLink
                  href="/dashboard"
                  variant="primary"
                  size="lg"
                  className="premium-3d-card group h-[46px] w-full rounded-xl px-6 shadow-xl shadow-primary-500/25 sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" />
                  Comenzar ahora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  asLink
                  href="/help"
                  variant="outline"
                  size="lg"
                  className="premium-3d-card h-[46px] w-full rounded-xl border-primary-500 bg-white/80 px-6 text-primary-700 sm:w-auto dark:bg-transparent dark:text-primary-300"
                >
                  Ver guía
                  <BookOpen className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-16 grid w-full max-w-[760px] grid-cols-1 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} data-hero-animate="stat" className="premium-3d-card flex min-h-[76px] items-center gap-5 border-b border-slate-200 px-6 py-3.5 last:border-b-0 dark:border-slate-800 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                      <item.Icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-black leading-tight text-slate-950 dark:text-white">{item.value}</p>
                      <p className="mt-1 text-sm font-semibold leading-tight text-slate-500 dark:text-slate-400">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <InteractiveDemoPreview />
          </div>
        </section>
      </main>

      <Footer className="-mt-64" />
    </>
  )
}

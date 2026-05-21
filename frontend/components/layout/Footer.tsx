'use client'

import Link from 'next/link'
import {
  CheckCircle2,
  FileText,
  Github,
  ListChecks,
  Lock,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'

const trustItems = [
  { title: 'Privacidad absoluta', text: 'Sin conexión a internet', Icon: ShieldCheck, color: 'text-primary-600 bg-primary-50' },
  { title: 'Cumple normativas', text: 'Ley 19.628 · GDPR Ready', Icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  { title: 'Sin filtraciones', text: 'Datos nunca salen de tu equipo', Icon: Lock, color: 'text-indigo-600 bg-indigo-50' },
  { title: 'Auditable', text: 'Trazabilidad completa', Icon: ListChecks, color: 'text-blue-600 bg-blue-50' },
  { title: 'Formatos compatibles', text: 'Excel, CSV, PDF, SQL, JSON y más', Icon: FileText, color: 'text-teal-600 bg-teal-50' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-transparent px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl 2xl:max-w-[1800px]">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/88 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div className="absolute right-8 top-3 hidden h-24 w-28 opacity-80 2xl:block">
            <div className="absolute right-6 top-2 h-20 w-16 rounded-2xl border border-primary-100 bg-white shadow-2xl shadow-primary-500/10">
              <div className="mx-3 mt-4 h-1.5 rounded-full bg-primary-300" />
              <div className="mx-3 mt-3 h-1.5 rounded-full bg-slate-200" />
              <div className="mx-3 mt-2 h-1.5 rounded-full bg-slate-200" />
            </div>
            <div className="absolute bottom-1 right-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-xl shadow-primary-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.55fr_0.7fr_0.6fr] md:items-start 2xl:pr-32">
            <div className="max-w-lg">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/40 dark:text-primary-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-950 dark:text-white">Anonimizador</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Protección local</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
                Revisa y transforma archivos con datos personales antes de compartirlos o analizarlos. Todo ocurre en tu equipo.
              </p>
            </div>

            <nav aria-label="Producto">
              <h4 className="text-xs font-black uppercase tracking-wide text-slate-950 dark:text-white">Producto</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400">
                    Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400">
                    Documentación
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wide text-slate-950 dark:text-white">Flujo</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <SearchCheck className="h-4 w-4 text-teal-600" />
                  Detección previa
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary-600" />
                  Descarga controlada
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wide text-slate-950 dark:text-white">Proyecto</h4>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400"
              >
                <Github className="h-4 w-4" />
                Repositorio
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-xl bg-white/75 p-3 shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-slate-950/55">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                <item.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-slate-950 dark:text-white 2xl:text-sm">{item.title}</p>
                <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400 2xl:text-xs">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

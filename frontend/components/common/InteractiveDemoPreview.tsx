'use client'

import React, { useEffect, useState } from 'react'
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Mail,
  MapPin,
  Pause,
  Users,
} from 'lucide-react'

export function InteractiveDemoPreview() {
  const [progress, setProgress] = useState(49)
  const [stats, setStats] = useState({
    persons: 29,
    locations: 6,
    ruts: 18,
    emails: 25,
  })
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsProcessing(false)
          return 100
        }
        return prev + Math.random() * 4
      })
    }, 900)

    return () => clearInterval(interval)
  }, [isProcessing])

  useEffect(() => {
    if (!isProcessing && progress >= 100) {
      const timeout = setTimeout(() => {
        setProgress(49)
        setStats({ persons: 29, locations: 6, ruts: 18, emails: 25 })
        setIsProcessing(true)
      }, 3000)

      return () => clearTimeout(timeout)
    }

    return undefined
  }, [isProcessing, progress])

  useEffect(() => {
    if (!isProcessing) return

    const statInterval = setInterval(() => {
      setStats((prev) => ({
        persons: Math.min(prev.persons + Math.floor(Math.random() * 10), 2450),
        locations: Math.min(prev.locations + Math.floor(Math.random() * 6), 890),
        ruts: Math.min(prev.ruts + Math.floor(Math.random() * 8), 1240),
        emails: Math.min(prev.emails + Math.floor(Math.random() * 9), 3420),
      }))
    }, 650)

    return () => clearInterval(statInterval)
  }, [isProcessing])

  const statCards = [
    { label: 'Personas', suffix: 'detectadas', value: stats.persons, Icon: Users, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'RUTs', suffix: 'detectados', value: stats.ruts, Icon: BadgeCheck, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Correos', suffix: 'detectados', value: stats.emails, Icon: Mail, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Ubicaciones', suffix: 'detectadas', value: stats.locations, Icon: MapPin, color: 'text-teal-600 dark:text-teal-400' },
  ]

  return (
    <div className="relative hidden min-w-0 lg:block">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-100/70 via-white to-teal-100/70 blur-2xl dark:from-blue-950/30 dark:via-slate-950 dark:to-teal-950/30" />
      <div className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 2xl:max-w-[820px]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/40 dark:text-primary-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Archivo actual</p>
              <p className="text-base font-black text-slate-950 dark:text-white">denuncias_mayo.xlsx</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">4 columnas sensibles detectadas</p>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Local
          </span>
        </div>

        <div className="p-3.5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                {isProcessing ? (
                  <Clock3 className="h-5 w-5 text-primary-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-black text-slate-600 dark:text-slate-400">
                  {isProcessing ? 'Anonimizando archivo' : 'Archivo listo'}
                </p>
                <p className="text-3xl font-black tracking-tight text-primary-600 dark:text-primary-300">
                  {Math.min(Math.round(progress), 100)}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Estado</p>
              <p className="mt-1 text-sm font-black text-primary-600 dark:text-primary-300">
                {isProcessing ? 'En progreso' : 'Completado'}
              </p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 via-blue-600 to-teal-500 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <stat.Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className={`mt-1.5 text-xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.suffix}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-[1fr_auto_1fr_auto] bg-slate-50 px-5 py-2 text-xs font-black uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <span>Original</span>
              <span />
              <span>Anonimizado</span>
              <span />
            </div>
            {[
              ['Juan Perez', 'Persona_001'],
              ['12.345.678-9', 'RUT_001'],
              ['juan@mail.com', 'correo_001@local'],
            ].map(([source, target]) => (
              <div key={source} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 border-t border-slate-200 px-5 py-2 text-sm dark:border-slate-800">
                <span className="truncate font-medium text-slate-600 dark:text-slate-400">{source}</span>
                <span className="text-slate-300 dark:text-slate-700">-&gt;</span>
                <span className="truncate font-black text-slate-950 dark:text-white">{target}</span>
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
            ))}
          </div>

          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 py-2.5 text-base font-black text-primary-700 transition-all hover:bg-primary-100 active:scale-[0.99] dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300">
            {isProcessing ? <Pause className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isProcessing ? 'Pausar proceso' : 'Descargar resultados'}
          </button>
        </div>
      </div>
    </div>
  )
}

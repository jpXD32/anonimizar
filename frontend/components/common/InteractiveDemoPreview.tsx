'use client'

import React, { useEffect, useState } from 'react'
import { AnimatedCounter } from './AnimatedCounter'

export function InteractiveDemoPreview() {
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    persons: 0,
    locations: 0,
    ruts: 0,
    emails: 0,
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
        return prev + Math.random() * 15
      })
    }, 400)

    return () => clearInterval(interval)
  }, [isProcessing])

  useEffect(() => {
    if (!isProcessing && progress >= 100) {
      setTimeout(() => {
        setProgress(0)
        setStats({ persons: 0, locations: 0, ruts: 0, emails: 0 })
        setIsProcessing(true)
      }, 3000)
    }
  }, [isProcessing, progress])

  useEffect(() => {
    if (isProcessing) {
      const statInterval = setInterval(() => {
        setStats((prev) => ({
          persons: Math.min(prev.persons + Math.floor(Math.random() * 15), 2450),
          locations: Math.min(prev.locations + Math.floor(Math.random() * 8), 890),
          ruts: Math.min(prev.ruts + Math.floor(Math.random() * 12), 1240),
          emails: Math.min(prev.emails + Math.floor(Math.random() * 10), 3420),
        }))
      }, 600)

      return () => clearInterval(statInterval)
    }
  }, [isProcessing])

  return (
    <div className="relative hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl" />
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl overflow-hidden">
        {/* Browser Bar */}
        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 px-4 py-1.5 mx-2 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
            localhost:3000/dashboard
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {isProcessing ? '⏳ Procesando archivo...' : '✅ Completado'}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {Math.min(Math.round(progress), 100)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Anonimizando datos</p>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">
                {isProcessing ? 'En progreso...' : 'Completado'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Stats Grid - Live Updates */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { label: 'Personas', value: stats.persons, icon: '👤' },
              { label: 'Ubicaciones', value: stats.locations, icon: '📍' },
              { label: 'RUTs', value: stats.ruts, icon: '🆔' },
              { label: 'Emails', value: stats.emails, icon: '📧' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50"
              >
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  {stat.icon} {stat.label}
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button className="w-full py-2.5 mt-4 rounded-lg bg-gradient-to-r from-primary-500 to-accent-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
            {isProcessing ? '⏸ Pausar' : '📥 Descargar Resultados'}
          </button>
        </div>

        {/* Animated Glow */}
        <div className="absolute inset-0 rounded-3xl border border-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  )
}

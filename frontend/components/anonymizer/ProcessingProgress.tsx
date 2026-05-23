'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3, FileText, Mail, MapPin, Phone, User } from 'lucide-react'

interface ProcessingProgressProps {
  progress: number
  status: string
  statistics: {
    persons: number
    locations: number
    ruts: number
    emails: number
    phones: number
  }
}

export function ProcessingProgress({
  progress,
  status,
  statistics,
}: ProcessingProgressProps) {
  const safeProgress = Math.max(0, Math.min(progress, 100))
  const stats = [
    { icon: User, label: 'Personas', value: statistics.persons, color: 'text-blue-600' },
    { icon: MapPin, label: 'Ubicaciones', value: statistics.locations, color: 'text-green-600' },
    { icon: FileText, label: 'RUTs', value: statistics.ruts, color: 'text-orange-600' },
    { icon: Mail, label: 'Emails', value: statistics.emails, color: 'text-purple-600' },
    { icon: Phone, label: 'Teléfonos', value: statistics.phones, color: 'text-red-600' },
  ]

  return (
    <Card className="border-cyan-100/70 bg-white/86 shadow-[0_20px_70px_rgba(79,95,217,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/86">
      <CardContent className="space-y-8 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Procesando datos
            </h3>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-black text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
              {safeProgress}%
            </span>
          </div>

          <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 via-blue-600 to-teal-500 transition-all duration-700"
              style={{ width: `${safeProgress}%` }}
            />
            <div className="absolute inset-0 animate-pulse bg-white/20" />
          </div>

          <p className="animate-pulse text-sm font-medium text-slate-600 dark:text-slate-400">
            {status || 'Procesando archivo...'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/70"
              >
                <Icon className={`mx-auto h-5 w-5 ${stat.color}`} />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

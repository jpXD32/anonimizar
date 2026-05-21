'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3, User, MapPin, Mail, Phone, FileText } from 'lucide-react'

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
  const stats = [
    { icon: User, label: 'Personas', value: statistics.persons, color: 'text-blue-600' },
    { icon: MapPin, label: 'Ubicaciones', value: statistics.locations, color: 'text-green-600' },
    { icon: FileText, label: 'RUTs', value: statistics.ruts, color: 'text-orange-600' },
    { icon: Mail, label: 'Emails', value: statistics.emails, color: 'text-purple-600' },
    { icon: Phone, label: 'Teléfonos', value: statistics.phones, color: 'text-red-600' },
  ]

  return (
    <Card className="border-0 bg-gradient-card">
      <CardContent className="pt-8 space-y-8">
        {/* Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Procesando Datos
            </h3>
            <span className="text-sm font-medium text-primary-600">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-accent-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Text */}
          <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
            {status}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-2"
              >
                <Icon className={`w-5 h-5 mx-auto ${stat.color}`} />
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
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

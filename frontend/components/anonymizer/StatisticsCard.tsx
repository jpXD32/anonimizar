'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatisticsCardProps {
  icon: LucideIcon | string
  label: string
  value: number
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  trend?: number
  loading?: boolean
}

const colorStyles = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

export function StatisticsCard({
  icon: Icon,
  label,
  value,
  color = 'blue',
  trend,
  loading = false,
}: StatisticsCardProps) {
  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {value.toLocaleString()}
            </p>
            {trend !== undefined && (
              <span className={cn(
                'text-xs font-semibold',
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-slate-600'
              )}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>

        {typeof Icon === 'string' ? (
          <div className={cn(
            'text-2xl p-2 rounded-lg',
            colorStyles[color]
          )}>
            {Icon}
          </div>
        ) : (
          <div className={cn(
            'p-2 rounded-lg',
            colorStyles[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

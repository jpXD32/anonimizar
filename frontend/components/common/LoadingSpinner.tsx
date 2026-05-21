'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  subtitle?: string
  remainingTime?: number
  fullScreen?: boolean
  showTips?: boolean
}

export function LoadingSpinner({
  size = 'md',
  text,
  subtitle,
  remainingTime,
  fullScreen = false,
  showTips = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-6">
      {/* Main spinner with multiple layers */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={cn(
            'rounded-full border-slate-200 dark:border-slate-700',
            'border-t-primary-600 dark:border-t-primary-500',
            'animate-spin',
            sizeClasses[size]
          )}
        />
        {/* Inner pulsing ring */}
        <div
          className={cn(
            'absolute inset-2 rounded-full border-2',
            'border-transparent border-t-accent-500 border-r-accent-500',
            'animate-spin-slow'
          )}
          style={{ animationDirection: 'reverse' }}
        />
        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'opacity-20 blur-lg',
            'animate-scale-pulse',
            'bg-gradient-to-r from-primary-500 to-accent-500'
          )}
        />
      </div>

      {/* Loading text with subtitle */}
      {text && (
        <div className="space-y-3 text-center max-w-xs">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {text}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 animate-slide-right">
              {subtitle}
            </p>
          )}

          {/* Bouncing dots */}
          <div className="flex gap-1 justify-center pt-2">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Remaining time */}
          {remainingTime !== undefined && remainingTime > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
              ⏱️ ~{remainingTime}s restantes
            </p>
          )}
        </div>
      )}

      {/* Tips */}
      {showTips && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg max-w-sm">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            💡 Datos locales, datos seguros
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Tus datos se procesan 100% en tu computadora sin enviar a ningún servidor.
          </p>
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center">{spinner}</div>
}

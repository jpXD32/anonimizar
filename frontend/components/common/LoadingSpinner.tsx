'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Main spinner */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-slate-200 dark:border-slate-700',
            'border-t-primary-600 dark:border-t-primary-500',
            'animate-spin',
            sizeClasses[size]
          )}
        />
        {/* Inner glow effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'opacity-20 blur-md',
            'border-primary-600 dark:border-primary-500',
            sizeClasses[size]
          )}
          style={{
            animation: 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      </div>

      {/* Loading text */}
      {text && (
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {text}
          </p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
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

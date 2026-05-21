'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'dots'
  text?: string
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className={cn(sizeClasses[size], 'relative')}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-spin" />
          <div className="absolute inset-1 bg-white dark:bg-slate-950 rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-pulse" />
        </div>
        {text && (
          <p className={cn('font-medium text-slate-700 dark:text-slate-300', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn('font-medium text-slate-700 dark:text-slate-300', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className={cn(sizeClasses[size], 'relative')}>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-accent-500 rounded-full animate-spin" />
        <div className="absolute inset-2 border-2 border-primary-500/30 rounded-full animate-pulse" />
        <div className="absolute inset-1 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-20 animate-bounce" />
        <div className="absolute inset-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full" />
      </div>
      {text && (
        <p className={cn('font-medium text-slate-700 dark:text-slate-300', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )
}

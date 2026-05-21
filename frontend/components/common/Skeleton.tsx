'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'card' | 'circle' | 'table'
  count?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'line', count = 1, ...props }, ref) => {
    if (variant === 'circle') {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800',
            'animate-pulse',
            className
          )}
          {...props}
        />
      )
    }

    if (variant === 'card') {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4',
            'bg-white dark:bg-slate-900',
            className
          )}
          {...props}
        >
          {/* Header shimmer */}
          <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg w-3/4 skeleton-shimmer" />

          {/* Content lines */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-md skeleton-shimmer"
              style={{
                width: `${100 - i * 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )
    }

    if (variant === 'table') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {/* Header row */}
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-10 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-md skeleton-shimmer"
              />
            ))}
          </div>

          {/* Data rows */}
          {Array.from({ length: count || 5 }).map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, colIdx) => (
                <div
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="h-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-md skeleton-shimmer"
                  style={{
                    animationDelay: `${(rowIdx * 5 + colIdx) * 0.05}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )
    }

    // Default: line variant
    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {Array.from({ length: count || 3 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-md skeleton-shimmer"
            style={{
              width: i === (count || 3) - 1 ? '80%' : '100%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    )
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton }

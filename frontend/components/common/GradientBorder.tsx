'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  animated?: boolean
}

export function GradientBorder({
  children,
  className = '',
  animated = true
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        'relative p-[1px] rounded-2xl',
        animated && 'group',
        className
      )}
      style={{
        background: animated
          ? 'conic-gradient(from 180deg at 50% 50%, #3B82F6, #8B5CF6, #3B82F6)'
          : 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
      }}
    >
      <div className={cn(
        'relative bg-white dark:bg-slate-950 rounded-[15px]',
        animated && 'group-hover:shadow-xl group-hover:shadow-primary-500/20 transition-shadow duration-300'
      )}>
        {children}
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="relative inline-block">
        <input
          type="checkbox"
          ref={ref}
          id={checkboxId}
          className="sr-only peer"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-center justify-center w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md cursor-pointer',
            'transition-all peer-checked:bg-primary-600 peer-checked:border-primary-600',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
            'dark:peer-focus-visible:ring-offset-slate-900',
            className
          )}
        >
          <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

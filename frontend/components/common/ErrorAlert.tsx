'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorAlertProps {
  title?: string
  message: string
  onDismiss?: () => void
  onRetry?: () => void
  closable?: boolean
}

export function ErrorAlert({
  title = 'Error',
  message,
  onDismiss,
  onRetry,
  closable = true,
}: ErrorAlertProps) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-800 dark:text-red-200 break-words">
            {message}
          </p>

          {/* Action Buttons */}
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onRetry}
                >
                  🔄 Reintentar
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                >
                  Descartar
                </Button>
              )}
            </div>
          )}
        </div>

        {closable && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

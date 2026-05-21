'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
  steps?: Array<{ label: string; description?: string }>
}

const defaultSteps = [
  { label: 'Carga', description: 'Sube tu archivo' },
  { label: 'Configura', description: 'Selecciona columnas' },
  { label: 'Procesa', description: 'Anonimiza datos' },
  { label: 'Descarga', description: 'Obtén resultados' },
]

export function StepIndicator({ currentStep, steps = defaultSteps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3 | 4
          const isActive = stepNumber <= currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300',
                    isCurrent
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-110'
                      : isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {isActive && stepNumber < currentStep ? '✓' : stepNumber}
                </div>
                <p className="text-xs font-medium mt-2 text-slate-900 dark:text-white text-center max-w-16">
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {stepNumber < steps.length && (
                <div className="flex-1 h-1 min-w-4 mx-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? 'rgb(59, 130, 246)' : 'rgb(226, 232, 240)'
                  }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  )
}

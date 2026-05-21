'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { CheckCircle2, Database } from 'lucide-react'

interface ColumnSelectorProps {
  columns: string[]
  selectedColumns: string[]
  selectAll: boolean
  onSelectColumns: (columns: string[]) => void
  onSelectAll: (value: boolean) => void
  onProcessing: () => void
}

export function ColumnSelector({
  columns,
  selectedColumns,
  selectAll,
  onSelectColumns,
  onSelectAll,
  onProcessing,
}: ColumnSelectorProps) {
  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      onSelectColumns(selectedColumns.filter((c) => c !== col))
    } else {
      onSelectColumns([...selectedColumns, col])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⚙️</span> Paso 2: Configura la Anonimización
        </CardTitle>
        <CardDescription>
          Selecciona qué columnas deseas anonimizar. Cada columna se procesará de forma segura.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Select All Premium Toggle */}
        <div className="relative p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border-2 border-primary-200 dark:border-primary-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Checkbox
                checked={selectAll}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
                Anonimizar TODAS las columnas
              </label>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Procesa todas las {columns.length} columnas del archivo
              </p>
            </div>
            {selectAll && (
              <CheckCircle2 className="w-6 h-6 text-primary-600 flex-shrink-0 animate-pulse" />
            )}
          </div>
        </div>

        {/* Columns Grid - Premium Cards */}
        {!selectAll && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary-600" />
                Selecciona columnas específicas:
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {columns.map((col) => {
                const isSelected = selectedColumns.includes(col)
                return (
                  <button
                    key={col}
                    onClick={() => toggleColumn(col)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 group ${
                      isSelected
                        ? 'bg-primary-600 dark:bg-primary-700 border-primary-600 dark:border-primary-600 shadow-lg shadow-primary-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 transition-all ${isSelected ? 'scale-110' : ''}`}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium truncate ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`}>
                          {col}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          isSelected
                            ? 'text-primary-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          Será anonimizado
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 animate-scale-pulse" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Premium Summary Card */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📊</span> Resumen de Configuración
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-medium">
                  Columnas Totales
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                  {columns.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-medium">
                  A Anonimizar
                </p>
                <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 mt-1">
                  {selectAll ? columns.length : selectedColumns.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-medium">
                  Estado Mapeos
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Activos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Premium */}
        <div className="pt-4 space-y-3">
          <Button
            onClick={onProcessing}
            variant="primary"
            fullWidth
            className="relative overflow-hidden group h-12 text-base font-semibold"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              <span>🚀</span>
              Comenzar Anonimización
            </span>
          </Button>
          {selectedColumns.length === 0 && !selectAll && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              ⚠️ Selecciona al menos una columna para continuar
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

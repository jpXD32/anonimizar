'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>👁️ Paso 2: Configura la Anonimización</CardTitle>
        <CardDescription>
          Selecciona qué columnas deseas anonimizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Select All Toggle */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Checkbox
            checked={selectAll}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <label className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer">
            Anonimizar TODAS las columnas
          </label>
        </div>

        {/* Columns Grid */}
        {!selectAll && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Selecciona columnas específicas:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {columns.map((col) => (
                <div key={col} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedColumns.includes(col)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectColumns([...selectedColumns, col])
                      } else {
                        onSelectColumns(selectedColumns.filter((c) => c !== col))
                      }
                    }}
                  />
                  <label className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    {col}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
            📊 Resumen:
          </p>
          <ul className="text-sm text-primary-700 dark:text-primary-300 mt-2 space-y-1">
            <li>• Columnas totales: {columns.length}</li>
            <li>• Columnas a anonimizar: {selectAll ? columns.length : selectedColumns.length}</li>
            <li>• Mapeos: Activos</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onProcessing}
            variant="primary"
            fullWidth
          >
            🚀 Comenzar Anonimización
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

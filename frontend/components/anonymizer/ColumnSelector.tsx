'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { CheckCircle2, Columns3, Database, Play, ShieldCheck } from 'lucide-react'

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
  const selectedCount = selectAll ? columns.length : selectedColumns.length

  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      onSelectColumns(selectedColumns.filter((c) => c !== col))
    } else {
      onSelectColumns([...selectedColumns, col])
    }
  }

  return (
    <Card className="p-0 shadow-sm hover:shadow-sm">
      <CardHeader className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/60">
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm dark:bg-slate-950 dark:text-primary-300">
            <Columns3 className="h-5 w-5" />
          </span>
          Configura la anonimización
        </CardTitle>
        <CardDescription className="pl-12">
          Elige las columnas que contienen datos sensibles.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <button
          type="button"
          onClick={() => onSelectAll(!selectAll)}
          className={`flex w-full items-center justify-between gap-4 rounded-lg border p-4 text-left transition-all ${
            selectAll
              ? 'border-primary-200 bg-primary-50 ring-1 ring-primary-200 dark:border-primary-900 dark:bg-primary-950/30 dark:ring-primary-900'
              : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900'
          }`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <Checkbox
              checked={selectAll}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-5 w-5"
            />
            <div className="min-w-0">
              <p className="font-bold text-slate-950 dark:text-white">Anonimizar todas las columnas</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Procesa las {columns.length} columnas del archivo.
              </p>
            </div>
          </div>
          {selectAll && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />}
        </button>

        {!selectAll && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Database className="h-4 w-4 text-primary-600" />
              Selección manual
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {columns.map((col) => {
                const isSelected = selectedColumns.includes(col)
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleColumn(col)}
                    className={`flex min-w-0 items-center gap-3 rounded-lg border px-3 py-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Checkbox checked={isSelected} onChange={() => {}} className="pointer-events-none h-4 w-4" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{col}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <section className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Columnas</p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{columns.length}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">A anonimizar</p>
            <p className="mt-1 text-2xl font-black text-primary-600 dark:text-primary-300">{selectedCount}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mapeos</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Activos
            </p>
          </div>
        </section>

        <div className="space-y-2 pt-1">
          <Button
            onClick={onProcessing}
            variant="primary"
            fullWidth
            disabled={selectedCount === 0}
            className="h-12 text-base font-semibold"
          >
            <Play className="h-4 w-4" />
            Comenzar anonimización
          </Button>
          {selectedCount === 0 && (
            <p className="text-center text-xs text-amber-600 dark:text-amber-400">
              Selecciona al menos una columna para continuar.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { CheckCircle2, Columns3, Database, Play, RotateCcw, ShieldCheck } from 'lucide-react'

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
  const hasSelection = selectedCount > 0

  const toggleColumn = (column: string) => {
    if (selectAll) {
      onSelectAll(false)
      onSelectColumns(columns.filter((item) => item !== column))
      return
    }

    if (selectedColumns.includes(column)) {
      onSelectColumns(selectedColumns.filter((item) => item !== column))
    } else {
      onSelectColumns([...selectedColumns, column])
    }
  }

  const selectEverything = () => {
    onSelectColumns([])
    onSelectAll(true)
  }

  const clearSelection = () => {
    onSelectAll(false)
    onSelectColumns([])
  }

  return (
    <section className="overflow-hidden bg-white/90 dark:bg-slate-950/90">
      <header className="border-b border-slate-200 bg-gradient-to-r from-white via-cyan-50/45 to-indigo-50/45 px-5 py-4 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900/80 dark:to-indigo-950/35">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-primary-300 dark:ring-slate-800">
              <Columns3 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Configura la anonimización
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                Marca las columnas que contienen datos sensibles antes de procesar.
              </p>
            </div>
          </div>

          <div className="grid min-w-[420px] grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white/85 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950/75 max-xl:min-w-0">
            <div className="px-3 py-1.5">
              <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Columnas</p>
              <p className="text-lg font-black text-slate-950 dark:text-white">{columns.length}</p>
            </div>
            <div className="px-3 py-1.5">
              <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Seleccionadas</p>
              <p className="text-lg font-black text-primary-600 dark:text-primary-300">{selectedCount}</p>
            </div>
            <div className="px-3 py-1.5">
              <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Mapeos</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-black text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Activos
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
            <Database className="h-4 w-4 text-primary-600" />
            Columnas del archivo
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectAll ? 'primary' : 'secondary'}
              size="sm"
              onClick={selectEverything}
              className="rounded-xl"
            >
              <CheckCircle2 className="h-4 w-4" />
              Anonimizar todo
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearSelection}
              className="rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {columns.map((column) => {
            const isSelected = selectAll || selectedColumns.includes(column)
            return (
              <button
                key={column}
                type="button"
                onClick={() => toggleColumn(column)}
                className={`flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? 'border-primary-300 bg-primary-50 text-primary-800 shadow-sm ring-1 ring-primary-100 dark:border-primary-700 dark:bg-primary-950/35 dark:text-primary-100 dark:ring-primary-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                <Checkbox checked={isSelected} onChange={() => {}} className="pointer-events-none h-5 w-5" />
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{column}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
          <p className={`px-2 text-sm font-bold ${hasSelection ? 'text-slate-600 dark:text-slate-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {hasSelection
              ? `${selectedCount} de ${columns.length} columnas listas para anonimizar.`
              : 'Selecciona al menos una columna para continuar.'}
          </p>
          <Button
            onClick={onProcessing}
            variant="primary"
            disabled={!hasSelection}
            className="h-11 min-w-[260px] rounded-xl text-base font-black"
          >
            <Play className="h-4 w-4" />
            Comenzar anonimización
          </Button>
        </div>
      </div>
    </section>
  )
}

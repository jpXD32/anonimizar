'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/common/Skeleton'
import { Table2 } from 'lucide-react'

interface DataPreviewProps {
  data: any[][] | null
  columns: string[]
  loading?: boolean
  rowsToShow?: number
}

export function DataPreview({
  data,
  columns,
  loading = false,
  rowsToShow = 5,
}: DataPreviewProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="w-5 h-5" />
            📋 Vista Previa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton variant="table" count={3} />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="w-5 h-5" />
            📋 Vista Previa
          </CardTitle>
          <CardDescription>
            No hay datos para mostrar
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table2 className="w-5 h-5" />
          📋 Vista Previa de Datos
        </CardTitle>
        <CardDescription>
          Mostrando {Math.min(rowsToShow, data.length)} de {data.length} filas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, rowsToShow).map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-sm"
                      title={String(row[colIdx] || '—')}
                    >
                      {row[colIdx] !== undefined && row[colIdx] !== null
                        ? String(row[colIdx]).length > 50
                          ? String(row[colIdx]).substring(0, 47) + '...'
                          : String(row[colIdx])
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

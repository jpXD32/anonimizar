'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Download, FileJson, FileSpreadsheet, Table } from 'lucide-react'

interface DownloadOptionsProps {
  onDownloadCSV: () => Promise<void>
  onDownloadExcel: () => Promise<void>
  onDownloadMappings: () => Promise<void>
  mappingsCount?: number
}

export function DownloadOptions({
  onDownloadCSV,
  onDownloadExcel,
  onDownloadMappings,
  mappingsCount = 0,
}: DownloadOptionsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleDownload = async (callback: () => Promise<void>, type: string) => {
    setLoading(type)
    try {
      await callback()
    } catch (error) {
      console.error(`Error downloading ${type}:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Descargar resultados
        </CardTitle>
        <CardDescription>
          Elige el formato que prefieres para tus datos anonimizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'csv'}
            onClick={() => handleDownload(onDownloadCSV, 'csv')}
            className="flex items-center justify-center gap-2"
          >
            <Table className="h-4 w-4" />
            <span>CSV</span>
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'excel'}
            onClick={() => handleDownload(onDownloadExcel, 'excel')}
            className="flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel</span>
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'mappings'}
            onClick={() => handleDownload(onDownloadMappings, 'mappings')}
            disabled={mappingsCount === 0}
            className="flex items-center justify-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            <span>Mapeos JSON</span>
          </Button>
        </div>

        {mappingsCount > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Se generaron <strong>{mappingsCount.toLocaleString()}</strong> mapeos de anonimización.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Download, Copy, Check } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

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
          <Download className="w-5 h-5" />
          💾 Descargar Resultados
        </CardTitle>
        <CardDescription>
          Elige el formato que prefieres para tus datos anonimizados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'csv'}
            onClick={() => handleDownload(onDownloadCSV, 'csv')}
            className="flex items-center justify-center gap-2"
          >
            <span>📄</span>
            <span>CSV</span>
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'excel'}
            onClick={() => handleDownload(onDownloadExcel, 'excel')}
            className="flex items-center justify-center gap-2"
          >
            <span>📊</span>
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
            <span>🔐</span>
            <span>Mapeos JSON</span>
          </Button>
        </div>

        {mappingsCount > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ℹ️ Se generaron <strong>{mappingsCount.toLocaleString()}</strong> mapeos de anonimización
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

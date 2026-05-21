'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Copy, Download, Check, Eye, EyeOff } from 'lucide-react'

interface MappingsViewerProps {
  mappings: Record<string, string>
  onDownload?: () => Promise<void>
}

export function MappingsViewer({ mappings, onDownload }: MappingsViewerProps) {
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const mappingEntries = Object.entries(mappings)
  const displayEntries = showAll ? mappingEntries : mappingEntries.slice(0, 10)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(mappings, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying mappings:', error)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      if (onDownload) {
        await onDownload()
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔐</span> Diccionario de Mapeos
        </CardTitle>
        <CardDescription>
          {mappingEntries.length} mapeos generados (original → anonimizado)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </Button>
          {onDownload && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              loading={downloading}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </Button>
          )}
        </div>

        {/* Mappings Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                  Original
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                  Anonimizado
                </th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.map(([original, anonymized], i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-xs font-mono text-xs">
                    <code>{original.substring(0, 50)}{original.length > 50 ? '...' : ''}</code>
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white truncate max-w-xs font-mono text-xs">
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {anonymized}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More */}
        {mappingEntries.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 px-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                <EyeOff className="w-4 h-4" />
                Mostrar menos ({mappingEntries.length - 10} ocultos)
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Mostrar todos ({mappingEntries.length} total)
              </>
            )}
          </button>
        )}

        {/* Warning */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-900 dark:text-amber-100">
            ⚠️ Guarda estos mapeos en lugar seguro. Sin ellos, la anonimización es irreversible.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

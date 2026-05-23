'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Check, Copy, Download, Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react'
import { encryptAndDownloadJson } from '@/lib/utils'

interface MappingsViewerProps {
  mappings: Record<string, string>
  onDownload?: () => Promise<void>
}

export function MappingsViewer({ mappings, onDownload }: MappingsViewerProps) {
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [encrypting, setEncrypting] = useState(false)

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

  const handleEncryptedDownload = async () => {
    const password = window.prompt('Contraseña para cifrar los mapeos (mínimo 12 caracteres)')
    if (!password) return

    setEncrypting(true)
    try {
      await encryptAndDownloadJson(mappings, 'mappings.encrypted.json', password)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudieron cifrar los mapeos')
    } finally {
      setEncrypting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary-600" />
          Diccionario de Mapeos
        </CardTitle>
        <CardDescription>
          {mappingEntries.length} mapeos generados (original -&gt; anonimizado)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex gap-2 text-xs leading-5 text-amber-900 dark:text-amber-100">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Este archivo permite relacionar valores anonimizados con datos originales.
              Guárdalo separado del archivo anonimizado y usa la descarga cifrada si lo vas a conservar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
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
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEncryptedDownload}
            loading={encrypting}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Descargar cifrado
          </Button>
        </div>

        <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
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
              {displayEntries.map(([original, anonymized], index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                    <code>{original.substring(0, 50)}{original.length > 50 ? '...' : ''}</code>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-slate-900 dark:text-white">
                    <code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                      {anonymized}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mappingEntries.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
          >
            {showAll ? (
              <>
                <EyeOff className="h-4 w-4" />
                Mostrar menos ({mappingEntries.length - 10} ocultos)
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Mostrar todos ({mappingEntries.length} total)
              </>
            )}
          </button>
        )}

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xs text-amber-900 dark:text-amber-100">
            Guarda estos mapeos en lugar seguro. Sin ellos, la anonimización es irreversible.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

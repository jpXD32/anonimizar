'use client'

import React, { useRef } from 'react'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatBytes } from '@/lib/utils'
import Papa from 'papaparse'

interface FileUploadProps {
  onFileData: (data: any[][], columns: string[]) => void
}

export function FileUpload({ onFileData }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)

  const handleFile = (file: File) => {
    if (!file) return

    setProcessing(true)

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const columns = results.data[0] as string[]
            const data = results.data.slice(1)
            onFileData(data, columns)
          }
          setProcessing(false)
        },
        error: () => {
          setProcessing(false)
        },
      })
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // For Excel files, you would need to use a library like xlsx
      // This is a placeholder - in production, use XLSX library
      alert('Excel support coming soon. Please use CSV format.')
      setProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary-600" />
          📤 Paso 1: Carga tu Archivo
        </CardTitle>
        <CardDescription>
          Selecciona un archivo CSV o Excel con los datos que deseas anonimizar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            onChange={handleInputChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
            disabled={processing}
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {processing ? '⏳ Procesando...' : 'Arrastra tu archivo aquí'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                O haz clic para seleccionar
              </p>
            </div>

            <div className="flex gap-4 justify-center text-xs text-slate-600 dark:text-slate-400">
              <span>📊 CSV</span>
              <span>•</span>
              <span>📈 Excel</span>
              <span>•</span>
              <span>Max 50 MB</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

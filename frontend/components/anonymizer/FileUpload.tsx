'use client'

import React, { useRef } from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/common/Skeleton'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface FileUploadProps {
  onFileData: (data: any[][], columns: string[], file: File) => void
  onError?: (message: string) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024
const MAX_ROWS = 100000
const MAX_COLUMNS = 200
const MAX_CELLS = 2000000
const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls']

function getExtension(filename: string) {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase()
}

function validateParsedShape(rows: number, columns: number) {
  if (rows > MAX_ROWS) return `El archivo supera el máximo de ${MAX_ROWS.toLocaleString()} filas`
  if (columns > MAX_COLUMNS) return `El archivo supera el máximo de ${MAX_COLUMNS.toLocaleString()} columnas`
  if (rows * columns > MAX_CELLS) return `El archivo supera el máximo de ${MAX_CELLS.toLocaleString()} celdas`
  return null
}

export function FileUpload({ onFileData, onError }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)

  const handleFile = (file: File) => {
    if (!file) return

    const extension = getExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      onError?.('Formato no permitido. Usa CSV, XLSX o XLS.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      onError?.('El archivo supera el máximo de 50 MB.')
      return
    }

    setProcessing(true)

    if (extension === '.csv') {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const columns = results.data[0] as string[]
            const data = results.data.slice(1) as any[][]
            const shapeError = validateParsedShape(data.length, columns.length)
            if (shapeError) {
              onError?.(shapeError)
              setProcessing(false)
              return
            }
            onFileData(data, columns, file)
          }
          setProcessing(false)
        },
        error: () => {
          onError?.('No se pudo leer el CSV.')
          setProcessing(false)
        },
      })
    } else if (extension === '.xlsx' || extension === '.xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          if (jsonData && jsonData.length > 0) {
            const columns = jsonData[0] as string[]
            const rows = jsonData.slice(1) as any[][]
            const shapeError = validateParsedShape(rows.length, columns.length)
            if (shapeError) {
              onError?.(shapeError)
              setProcessing(false)
              return
            }
            onFileData(rows, columns, file)
          }
        } catch (error) {
          onError?.('No se pudo leer el archivo Excel.')
        }
        setProcessing(false)
      }
      reader.readAsArrayBuffer(file)
    } else {
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
    <Card className="premium-3d-panel-clean overflow-hidden border-cyan-100/70 bg-white/86 p-0 shadow-[0_24px_90px_rgba(79,95,217,0.10)] backdrop-blur-2xl hover:shadow-[0_28px_100px_rgba(79,95,217,0.14)] dark:border-slate-800 dark:bg-slate-950/86">
      <CardHeader className="border-b border-cyan-100/70 bg-gradient-to-r from-white/84 via-cyan-50/52 to-indigo-50/48 px-5 py-2.5 dark:border-slate-800 dark:from-slate-950/80 dark:via-slate-900/70 dark:to-indigo-950/35">
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="premium-depth-chip flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-slate-950 dark:text-primary-300">
            <FileSpreadsheet className="h-5 w-5" />
          </span>
          Carga tu archivo
        </CardTitle>
        <CardDescription className="pl-12">
          Selecciona un archivo CSV o Excel con los datos que deseas anonimizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        {processing ? (
          <div className="space-y-4">
            <Skeleton variant="circle" className="mx-auto h-16 w-16" />
            <Skeleton variant="line" count={3} />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={handleClick}
            className={`premium-3d-card relative cursor-pointer rounded-2xl border border-dashed px-8 py-6 text-center transition-all ${
              isDragging
                ? 'border-primary-500 bg-primary-50 shadow-[0_0_0_4px_rgba(79,95,217,0.10)] dark:bg-primary-900/20'
                : 'border-cyan-200/80 bg-white/72 hover:border-primary-400 hover:bg-cyan-50/35 dark:border-slate-700 dark:bg-slate-950/72 dark:hover:border-primary-600 dark:hover:bg-slate-900/70'
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

            <div className="space-y-2.5">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 shadow-[0_14px_34px_rgba(79,95,217,0.14)] dark:bg-primary-950/40">
                  <Upload className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                </div>
              </div>

              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  Arrastra tu archivo aquí
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  O haz clic para seleccionar
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">CSV</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Excel</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Max 50 MB</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


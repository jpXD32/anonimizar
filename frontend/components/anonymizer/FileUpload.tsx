'use client'

import React, { useRef } from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/common/Skeleton'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface FileUploadProps {
  onFileData: (data: any[][], columns: string[], file: File) => void
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
            const data = results.data.slice(1) as any[][]
            onFileData(data, columns, file)
          }
          setProcessing(false)
        },
        error: () => {
          setProcessing(false)
        },
      })
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
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
            onFileData(rows, columns, file)
          }
        } catch (error) {
          console.error('Error parsing Excel file:', error)
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
    <Card className="overflow-hidden p-0 shadow-sm hover:shadow-sm">
      <CardHeader className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/60">
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm dark:bg-slate-950 dark:text-primary-300">
            <FileSpreadsheet className="h-5 w-5" />
          </span>
          Carga tu archivo
        </CardTitle>
        <CardDescription className="pl-12">
          Selecciona un archivo CSV o Excel con los datos que deseas anonimizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
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
            className={`relative cursor-pointer rounded-lg border border-dashed p-10 text-center transition-all ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-slate-300 bg-white hover:border-primary-400 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-primary-600'
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
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/40">
                  <Upload className="h-7 w-7 text-primary-600 dark:text-primary-300" />
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  Arrastra tu archivo aquí
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  O haz clic para seleccionar
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>CSV</span>
                <span>Excel</span>
                <span>Max 50 MB</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

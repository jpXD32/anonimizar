'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileUpload } from '@/components/anonymizer/FileUpload'
import { ColumnSelector } from '@/components/anonymizer/ColumnSelector'
import { ProcessingProgress } from '@/components/anonymizer/ProcessingProgress'
import { Button } from '@/components/ui/Button'
import { useAnonymizerStore } from '@/store/anonymizer.store'
import {
  BadgeCheck,
  CheckCircle2,
  Download,
  FileUp,
  ShieldX,
  Mail,
  MapPin,
  Phone,
  Settings2,
  User,
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { downloadFile } from '@/lib/utils'
import { DataPreview } from '@/components/anonymizer/DataPreview'
import { DownloadOptions } from '@/components/anonymizer/DownloadOptions'
import { MappingsViewer } from '@/components/anonymizer/MappingsViewer'
import { ErrorAlert } from '@/components/common/ErrorAlert'

const stepMeta = [
  { title: 'Sube tu archivo', description: 'Carga un CSV o Excel para revisar sus columnas.', Icon: FileUp },
  { title: 'Configura columnas', description: 'Elige los campos que contienen datos sensibles.', Icon: Settings2 },
  { title: 'Procesa datos', description: 'Anonimiza el contenido de forma local.', Icon: BadgeCheck },
  { title: 'Descarga resultados', description: 'Guarda el archivo anonimizado y sus mapeos.', Icon: Download },
]

/**
 * Estima la duracion visible del procesamiento segun volumen de datos.
 */
function estimateProcessingMs(rowCount: number, columnCount: number, fileSize: number) {
  const rowWork = Math.max(rowCount, 1) * Math.max(columnCount, 1) * 3.2
  const fileWork = fileSize / 1800
  return Math.min(Math.max(9000, rowWork + fileWork), 540000)
}

/**
 * Calcula un porcentaje de avance que no simula finalizacion anticipada.
 */
function calculateProcessingProgress(elapsedMs: number, estimatedMs: number) {
  const ratio = Math.min(elapsedMs / estimatedMs, 1)
  const easedRatio = 1 - Math.pow(1 - ratio, 1.35)
  return Math.min(8 + Math.floor(easedRatio * 82), 90)
}

/**
 * Describe la etapa actual del procesamiento visible.
 */
function getProcessingStatus(progress: number) {
  if (progress < 22) return 'Validando estructura del archivo...'
  if (progress < 45) return 'Detectando datos sensibles...'
  if (progress < 72) return 'Anonimizando relatos y columnas seleccionadas...'
  if (progress < 90) return 'Generando resultado descargable...'
  return 'Esperando confirmacion del backend...'
}

export default function DashboardPage() {
  const store = useAnonymizerStore()
  const current = stepMeta[store.currentStep - 1]
  const CurrentIcon = current.Icon

  const handleFileData = (data: any[][], columns: string[], file: File) => {
    store.setFileData(data, columns, file)
  }

  const handleProcessing = async () => {
    const columnsToProcess = store.selectAll ? store.fileColumns : store.selectedColumns

    if (columnsToProcess.length === 0) {
      store.setError('Selecciona al menos una columna para anonimizar')
      return
    }

    if (!store.uploadedFile) {
      store.setError('No se encontró el archivo cargado')
      return
    }

    store.startProcessing()
    store.updateProgress(8, 'Preparando archivo y columnas...')
    const startedAt = Date.now()
    const estimatedMs = estimateProcessingMs(
      store.fileData?.length || 0,
      columnsToProcess.length,
      store.uploadedFile.size
    )
    const progressTimer = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAt
      const progress = calculateProcessingProgress(elapsedMs, estimatedMs)
      const status = getProcessingStatus(progress)

      store.updateProgress(progress, status)
    }, 1000)

    try {
      const response = await apiClient.anonymizeFile(
        store.uploadedFile,
        columnsToProcess,
        store.saveMappings
      )

      const anonymizedArray = response.anonymized_data.map(row =>
        response.columns.map(col => row[col])
      )

      window.clearInterval(progressTimer)
      store.updateProgress(96, 'Finalizando anonimizacion...')
      store.finishProcessing(
        anonymizedArray,
        response.statistics,
        response.mappings,
        response.columns,
        response.result_download_id || null,
        Boolean(response.result_truncated)
      )
    } catch (error) {
      window.clearInterval(progressTimer)
      store.setError(error instanceof Error ? error.message : 'Error durante el procesamiento')
    }
  }

  const handleDownloadCSV = async () => {
    try {
      if (store.resultDownloadId) {
        const blob = await apiClient.downloadCachedResult(store.resultDownloadId, 'csv')
        downloadFile(blob, 'anonymized-data.csv')
        return
      }

      const blob = await apiClient.downloadCSV(
        store.anonymizedData?.map(row =>
          Object.fromEntries(store.fileColumns.map((col, i) => [col, row[i]]))
        ) || []
      )
      downloadFile(blob, 'anonymized-data.csv')
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error descargando CSV')
    }
  }

  const handleDownloadExcel = async () => {
    try {
      if (store.resultDownloadId) {
        const blob = await apiClient.downloadCachedResult(store.resultDownloadId, 'excel')
        downloadFile(blob, 'anonymized-data.xlsx')
        return
      }

      const blob = await apiClient.downloadExcel(
        store.anonymizedData?.map(row =>
          Object.fromEntries(store.fileColumns.map((col, i) => [col, row[i]]))
        ) || []
      )
      downloadFile(blob, 'anonymized-data.xlsx')
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error descargando Excel')
    }
  }

  const handleDownloadMappings = async () => {
    try {
      const blob = await apiClient.downloadMappings(store.mappings)
      downloadFile(blob, 'mappings.json')
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error descargando mapeos')
    }
  }

  return (
    <>
      <Header />
      <main className="premium-page-bg min-h-0 overflow-x-hidden px-4 pb-5 pt-40 text-slate-950 dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5 2xl:max-w-[1500px]">
          <section className="premium-3d-panel-clean relative overflow-hidden rounded-2xl border border-cyan-100/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(79,95,217,0.10)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/82">
            <div className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-950/30" />
            <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-950/30" />
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="flex items-start gap-4">
                <div className="premium-depth-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/40 dark:text-primary-300">
                  <CurrentIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                    Paso {store.currentStep} de 4
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                    {current.title}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {current.description}
                  </p>
                </div>
              </div>

              <div className="relative grid grid-cols-4 gap-2">
                {stepMeta.map((step, index) => {
                  const stepNumber = index + 1
                  const active = stepNumber <= store.currentStep
                  const selected = stepNumber === store.currentStep
                  return (
                    <div key={step.title} className="min-w-0">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          active ? 'bg-gradient-to-r from-primary-600 via-blue-600 to-teal-500 shadow-[0_0_16px_rgba(79,95,217,0.28)]' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                      <div
                        className={`mt-2 rounded-xl border px-3 py-2 text-center text-xs font-black shadow-sm backdrop-blur ${
                          selected
                            ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-primary-500/10 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300'
                            : active
                            ? 'border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'
                            : 'border-slate-200 bg-white/45 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40'
                        }`}
                      >
                        {stepNumber}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {store.currentStep === 1 && (
            <div className="animate-fade-in premium-3d-stage mx-auto max-w-4xl">
              <FileUpload onFileData={handleFileData} onError={store.setError} />
            </div>
          )}

          {store.currentStep === 2 && store.fileColumns.length > 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="overflow-hidden rounded-2xl border border-cyan-100/70 bg-white/86 shadow-[0_20px_70px_rgba(79,95,217,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/86">
                <ColumnSelector
                  columns={store.fileColumns}
                  selectedColumns={store.selectedColumns}
                  selectAll={store.selectAll}
                  onSelectColumns={store.setSelectedColumns}
                  onSelectAll={store.setSelectAll}
                  onProcessing={handleProcessing}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-cyan-100/70 bg-white/86 shadow-[0_20px_70px_rgba(79,95,217,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/86">
                <DataPreview
                  data={store.fileData}
                  columns={store.fileColumns}
                  loading={false}
                  rowsToShow={5}
                />
              </div>

              <Button onClick={() => store.setCurrentStep(1)} variant="secondary" className="w-full">
                Volver
              </Button>
            </div>
          )}

          {store.currentStep === 3 && (
            <ProcessingProgress
              progress={store.processingProgress}
              status={store.processingStatus}
              statistics={store.statistics}
            />
          )}

          {store.currentStep === 4 && store.anonymizedData && (
            <div className="space-y-5 animate-fade-in">
              <section className="rounded-2xl border border-emerald-200 bg-white/86 p-6 shadow-[0_20px_70px_rgba(16,185,129,0.10)] backdrop-blur-2xl dark:border-emerald-900/60 dark:bg-slate-950/86">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                      Anonimización completada
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Tu archivo fue procesado correctamente.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {[
                    { label: 'Personas', value: store.statistics.persons, Icon: User, color: 'text-primary-600' },
                    { label: 'Ubicaciones', value: store.statistics.locations, Icon: MapPin, color: 'text-teal-600' },
                    { label: 'RUTs', value: store.statistics.ruts, Icon: BadgeCheck, color: 'text-indigo-600' },
                    { label: 'Emails', value: store.statistics.emails, Icon: Mail, color: 'text-blue-600' },
                    { label: 'Teléfonos', value: store.statistics.phones, Icon: Phone, color: 'text-rose-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                      <stat.Icon className={`h-5 w-5 ${stat.color}`} />
                      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{stat.value}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <DownloadOptions
                onDownloadCSV={handleDownloadCSV}
                onDownloadExcel={handleDownloadExcel}
                onDownloadMappings={handleDownloadMappings}
                mappingsCount={Object.keys(store.mappings).length}
              />

              {Object.keys(store.mappings).length > 0 && (
                <MappingsViewer mappings={store.mappings} onDownload={handleDownloadMappings} />
              )}

              <Button onClick={() => store.reset()} variant="secondary" fullWidth>
                Comenzar de nuevo
              </Button>

              <Button onClick={() => store.clearSensitiveData()} variant="danger" fullWidth>
                <ShieldX className="h-4 w-4" />
                Limpiar datos de la sesión
              </Button>
            </div>
          )}

          {store.error && (
            <ErrorAlert
              title="Error"
              message={store.error}
              onDismiss={() => store.setError(null)}
              closable
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}


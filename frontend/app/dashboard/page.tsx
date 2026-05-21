'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileUpload } from '@/components/anonymizer/FileUpload'
import { ColumnSelector } from '@/components/anonymizer/ColumnSelector'
import { ProcessingProgress } from '@/components/anonymizer/ProcessingProgress'
import { Button } from '@/components/ui/Button'
import { useAnonymizerStore } from '@/store/anonymizer.store'
import {
  BadgeCheck,
  ChevronDown,
  CheckCircle2,
  Download,
  FileUp,
  HelpCircle,
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

export default function DashboardPage() {
  const store = useAnonymizerStore()
  const [showHelp, setShowHelp] = useState(false)
  const current = stepMeta[store.currentStep - 1]
  const CurrentIcon = current.Icon

  const handleFileData = (data: any[][], columns: string[], file: File) => {
    store.setFileData(data, columns, file)
  }

  const handleProcessing = async () => {
    if (store.selectedColumns.length === 0) {
      store.setError('Selecciona al menos una columna para anonimizar')
      return
    }

    if (!store.uploadedFile) {
      store.setError('No se encontró el archivo cargado')
      return
    }

    store.startProcessing()

    try {
      const response = await apiClient.anonymizeFile(
        store.uploadedFile,
        store.selectedColumns,
        store.saveMappings
      )

      const anonymizedArray = response.anonymized_data.map(row =>
        response.columns.map(col => row[col])
      )

      store.finishProcessing(anonymizedArray, response.statistics, response.mappings)
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error durante el procesamiento')
    }
  }

  const handleDownloadCSV = async () => {
    try {
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
      <main className="premium-page-bg min-h-screen px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
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

              <div className="grid grid-cols-4 gap-2">
                {stepMeta.map((step, index) => {
                  const stepNumber = index + 1
                  const active = stepNumber <= store.currentStep
                  const selected = stepNumber === store.currentStep
                  return (
                    <div key={step.title} className="min-w-0">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          active ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                      <div
                        className={`mt-2 rounded-lg border px-3 py-2 text-center text-xs font-bold ${
                          selected
                            ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300'
                            : active
                            ? 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                            : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/60'
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
            <div className="animate-fade-in">
              <FileUpload onFileData={handleFileData} />
            </div>
          )}

          {store.currentStep === 2 && store.fileColumns.length > 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <ColumnSelector
                  columns={store.fileColumns}
                  selectedColumns={store.selectedColumns}
                  selectAll={store.selectAll}
                  onSelectColumns={store.setSelectedColumns}
                  onSelectAll={store.setSelectAll}
                  onProcessing={handleProcessing}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
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
              <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900/60 dark:bg-slate-950">
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

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setShowHelp(!showHelp)}
            >
              <span className="flex items-center gap-3 text-base font-bold text-slate-950 dark:text-white">
                <HelpCircle className="h-5 w-5 text-primary-600" />
                ¿Necesitas ayuda?
              </span>
              <ChevronDown
                className={`h-5 w-5 text-slate-500 transition-transform ${showHelp ? 'rotate-180' : ''}`}
              />
            </button>
            {showHelp && (
              <div className="grid gap-4 border-t border-slate-200 px-5 py-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400 md:grid-cols-2">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">¿Qué datos se anonimizan?</h3>
                  <p className="mt-1">
                    Nombres, RUTs chilenos, emails, teléfonos, ubicaciones y organizaciones.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">¿Es reversible?</h3>
                  <p className="mt-1">
                    Solo si conservas el archivo de mapeos. Guárdalo en un lugar seguro.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileUpload } from '@/components/anonymizer/FileUpload'
import { ColumnSelector } from '@/components/anonymizer/ColumnSelector'
import { ProcessingProgress } from '@/components/anonymizer/ProcessingProgress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { useAnonymizerStore } from '@/store/anonymizer.store'
import { Download, ChevronDown, BarChart3 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { downloadFile } from '@/lib/utils'
import { DataPreview } from '@/components/anonymizer/DataPreview'
import { DownloadOptions } from '@/components/anonymizer/DownloadOptions'
import { MappingsViewer } from '@/components/anonymizer/MappingsViewer'
import { ErrorAlert } from '@/components/common/ErrorAlert'

export default function DashboardPage() {
  const store = useAnonymizerStore()
  const [showHelp, setShowHelp] = useState(false)

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
      <main className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Premium Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Animated Orbs */}
          <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-400/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.1) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.1) 75%, rgba(99, 102, 241, 0.1) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.1) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.1) 75%, rgba(99, 102, 241, 0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px'
          }} />

          {/* Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100 dark:via-slate-900/30 dark:to-slate-900/50" />
        </div>

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Progress Indicator - Enhanced */}
          <div className="flex gap-4 items-center justify-between overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold font-black transition-all duration-300 shadow-lg ${
                    step <= store.currentStep
                      ? 'bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-primary-500/50 scale-110'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 backdrop-blur-sm'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1.5 flex-1 min-w-8 rounded-full transition-all duration-500 ${
                      step < store.currentStep
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600'
                        : 'bg-slate-200/50 dark:bg-slate-800/50'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Label - Enhanced */}
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
              Paso {store.currentStep} de 4
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-primary-700 to-slate-900 dark:from-white dark:via-primary-300 dark:to-white bg-clip-text text-transparent">
              {store.currentStep === 1 && '📤 Sube tu Archivo'}
              {store.currentStep === 2 && '⚙️ Configura Columnas'}
              {store.currentStep === 3 && '⏳ Procesando...'}
              {store.currentStep === 4 && '✅ Descarga Resultados'}
            </h1>
          </div>

          {/* Content by Step */}
          {store.currentStep === 1 && (
            <div className="animate-fade-in">
              <FileUpload onFileData={handleFileData} />
            </div>
          )}

          {store.currentStep === 2 && store.fileColumns.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />
                <div className="relative">
                  <ColumnSelector
                    columns={store.fileColumns}
                    selectedColumns={store.selectedColumns}
                    selectAll={store.selectAll}
                    onSelectColumns={store.setSelectedColumns}
                    onSelectAll={store.setSelectAll}
                    onProcessing={handleProcessing}
                  />
                </div>
              </div>

              {/* Data Preview */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />
                <div className="relative">
                  <DataPreview
                    data={store.fileData}
                    columns={store.fileColumns}
                    loading={false}
                    rowsToShow={5}
                  />
                </div>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => store.setCurrentStep(1)}
                variant="secondary"
                className="w-full"
              >
                ← Volver
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
            <div className="space-y-6 animate-fade-in">
              {/* Results Summary - Premium */}
              <div className="bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-xl rounded-2xl border border-green-200/50 dark:border-green-800/50 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                <div className="relative p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      ✅ Anonimización Completada
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Tu archivo ha sido procesado exitosamente con los siguientes resultados
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Personas', value: store.statistics.persons, icon: '👤' },
                      { label: 'Ubicaciones', value: store.statistics.locations, icon: '📍' },
                      { label: 'RUTs', value: store.statistics.ruts, icon: '🆔' },
                      { label: 'Emails', value: store.statistics.emails, icon: '📧' },
                      { label: 'Teléfonos', value: store.statistics.phones, icon: '📱' },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className="group relative p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-green-500/10 cursor-default"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 rounded-xl transition-all duration-300 pointer-events-none" />
                        <div className="relative space-y-1">
                          <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {stat.icon}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <DownloadOptions
                onDownloadCSV={handleDownloadCSV}
                onDownloadExcel={handleDownloadExcel}
                onDownloadMappings={handleDownloadMappings}
                mappingsCount={Object.keys(store.mappings).length}
              />

              {/* Mappings Viewer */}
              {Object.keys(store.mappings).length > 0 && (
                <MappingsViewer
                  mappings={store.mappings}
                  onDownload={handleDownloadMappings}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => store.reset()}
                  variant="secondary"
                  fullWidth
                >
                  🔄 Comenzar de Nuevo
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {store.error && (
            <ErrorAlert
              title="Error"
              message={store.error}
              onDismiss={() => store.setError(null)}
              closable
            />
          )}

          {/* Help Section - Enhanced */}
          <div className="mt-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div
              className="p-8 cursor-pointer flex items-center justify-between relative z-10 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => setShowHelp(!showHelp)}
            >
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                ❓ ¿Necesitas Ayuda?
              </h3>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 text-primary-600 dark:text-primary-400 ${showHelp ? 'rotate-180' : ''}`}
              />
            </div>
            {showHelp && (
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 p-8 space-y-6 relative z-10">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span>🔍</span> ¿Qué datos se anonimizeán?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Se detectan automáticamente: nombres, RUTs chilenos, emails, teléfonos, ubicaciones y organizaciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span>🔐</span> ¿Es reversible?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sin el archivo de mapeos, es irreversible. Guarda los mapeos de forma segura si necesitas recuperar los datos originales.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

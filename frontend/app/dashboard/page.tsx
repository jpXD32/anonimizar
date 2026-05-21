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
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Progress Indicator */}
          <div className="flex gap-4 items-center justify-between overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                    step <= store.currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 min-w-8 rounded-full transition-all ${
                      step < store.currentStep
                        ? 'bg-primary-600'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Label */}
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Paso {store.currentStep} de 4
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {store.currentStep === 1 && '📤 Sube tu Archivo'}
              {store.currentStep === 2 && '⚙️ Configura'}
              {store.currentStep === 3 && '⏳ Procesando'}
              {store.currentStep === 4 && '✅ Descarga Resultados'}
            </h1>
          </div>

          {/* Content by Step */}
          {store.currentStep === 1 && (
            <FileUpload onFileData={handleFileData} />
          )}

          {store.currentStep === 2 && store.fileColumns.length > 0 && (
            <div className="space-y-6">
              <ColumnSelector
                columns={store.fileColumns}
                selectedColumns={store.selectedColumns}
                selectAll={store.selectAll}
                onSelectColumns={store.setSelectedColumns}
                onSelectAll={store.setSelectAll}
                onProcessing={handleProcessing}
              />

              {/* Data Preview */}
              <DataPreview
                data={store.fileData}
                columns={store.fileColumns}
                loading={false}
                rowsToShow={5}
              />

              {/* Back Button */}
              <Button
                onClick={() => store.setCurrentStep(1)}
                variant="secondary"
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
            <div className="space-y-6">
              {/* Results Summary */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100">
                    ✅ Anonimización Completada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Personas', value: store.statistics.persons, icon: '👤' },
                      { label: 'Ubicaciones', value: store.statistics.locations, icon: '📍' },
                      { label: 'RUTs', value: store.statistics.ruts, icon: '🆔' },
                      { label: 'Emails', value: store.statistics.emails, icon: '📧' },
                      { label: 'Teléfonos', value: store.statistics.phones, icon: '📱' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stat.icon} {stat.value}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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

          {/* Help Section */}
          <Card className="mt-12">
            <div
              className="p-6 cursor-pointer flex items-center justify-between"
              onClick={() => setShowHelp(!showHelp)}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                ❓ ¿Necesitas Ayuda?
              </h3>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${showHelp ? 'rotate-180' : ''}`}
              />
            </div>
            {showHelp && (
              <CardContent className="border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    ¿Qué datos se anonimizeán?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Se detectan automáticamente: nombres, RUTs chilenos, emails, teléfonos, ubicaciones y organizaciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    ¿Es reversible?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sin el archivo de mapeos, es irreversible. Guarda los mapeos de forma segura si necesitas recuperar los datos originales.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

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

export default function DashboardPage() {
  const store = useAnonymizerStore()
  const [showHelp, setShowHelp] = useState(false)

  const handleFileData = (data: any[][], columns: string[]) => {
    store.setFileData(data, columns)
  }

  const handleProcessing = async () => {
    if (store.selectedColumns.length === 0) {
      store.setError('Selecciona al menos una columna para anonimizar')
      return
    }

    store.startProcessing()

    try {
      // Simulate processing - in production, call API
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        store.updateProgress(i, `Anonimizando... ${i}%`)
      }

      // Mock results
      const mockStats = {
        persons: Math.floor(Math.random() * 150),
        locations: Math.floor(Math.random() * 50),
        ruts: Math.floor(Math.random() * 100),
        emails: Math.floor(Math.random() * 120),
        phones: Math.floor(Math.random() * 80),
      }

      const mockMappings = {
        'person_juan': 'Persona_001',
        'email_juan@mail.com': 'correo_001@anonimizado.local',
      }

      store.finishProcessing(store.fileData || [], mockStats, mockMappings)
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error durante el procesamiento')
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    📋 Vista Previa de Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!store.fileData ? (
                    <Skeleton variant="table" count={3} />
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                              {store.fileColumns.map((col) => (
                                <th
                                  key={col}
                                  className="px-4 py-2 text-left font-semibold text-slate-900 dark:text-white"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(store.fileData || []).slice(0, 3).map((row, i) => (
                              <tr key={i} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                                {store.fileColumns.map((col, j) => (
                                  <td
                                    key={j}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 truncate"
                                  >
                                    {typeof row === 'object' && row !== null ? row[j] : '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                        Mostrando primeras 3 filas de {store.fileData?.length || 0} total
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    💾 Descargar Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!store.anonymizedData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-12 rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => alert('Implementar descarga CSV')}
                      >
                        📄 Descargar CSV
                      </Button>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => alert('Implementar descarga Excel')}
                      >
                        📊 Descargar Excel
                      </Button>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => alert('Implementar descarga Mapeos')}
                      >
                        🔐 Descargar Mapeos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

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
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <p className="text-red-900 dark:text-red-100">❌ {store.error}</p>
              </CardContent>
            </Card>
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

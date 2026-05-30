'use client'

import React, { useState } from 'react'

export default function DashboardPage() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processResult, setProcessResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File
    
    if (!file) {
      setError('Por favor selecciona un archivo')
      return
    }
    
    setIsProcessing(true)
    setStep(3)
    
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('columns', '["Fecha","Canal","Caso"," Nombre"," Plataforma","Relato ","Caracteres"]')
      uploadData.append('save_mappings', 'true')
      
      // Usar AbortController con timeout de 20 minutos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200000) // 20 minutos
      
      const response = await fetch('http://localhost:5000/api/anonymize', {
        method: 'POST',
        body: uploadData,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }
      
      const data = await response.json()
      setProcessResult(data)
      setStep(4)
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      setError('Error procesando archivo: ' + msg)
      setStep(1)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Steps */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                📁 Paso 1: Sube tu archivo
              </h1>
              <p className="text-gray-600 mb-6">
                Carga un archivo CSV o Excel para anonimizar
              </p>
              <form onSubmit={handleFileUpload}>
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-12 text-center mb-6">
                  <input 
                    type="file" 
                    name="file"
                    accept=".csv,.xlsx,.xls" 
                    required
                    className="block w-full text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '⏳ Procesando...' : '🚀 Procesar archivo'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ⏳ Procesando archivo
              </h1>
              <p className="text-gray-600 mb-6">
                Por favor espera. Esto puede tomar varios minutos para archivos grandes...
              </p>
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full w-full animate-pulse" />
                </div>
                <p className="text-gray-600 text-center font-semibold text-lg">
                  🔄 Anonimizando datos...
                </p>
              </div>
            </div>
          )}

          {step === 4 && processResult && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ✅ ¡Procesado correctamente!
              </h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Personas detectadas</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {processResult.statistics?.persons || 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Filas procesadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {processResult.total_rows || 0}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Emails detectados</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {processResult.statistics?.emails || 0}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">RUTs detectados</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {processResult.statistics?.ruts || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
                <h3 className="font-bold mb-2">📊 Vista previa de datos:</h3>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(processResult.anonymized_data?.slice(0, 1), null, 2)}
                </pre>
              </div>

              <button
                onClick={() => {
                  setStep(1)
                  setProcessResult(null)
                  setError(null)
                }}
                className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
              >
                ↻ Procesar otro archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

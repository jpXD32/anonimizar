'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, ChevronDown } from 'lucide-react'

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: '¿Qué datos detecta automáticamente?',
      answer: 'El sistema detecta automáticamente: nombres propios, RUTs chilenos, direcciones de email, números de teléfono, ubicaciones (ciudades, regiones), direcciones físicas y nombres de organizaciones.',
    },
    {
      question: '¿Cómo funciona la anonimización consistente?',
      answer: 'Si "Juan Pérez" aparece múltiples veces en tu archivo, siempre se reemplaza con el mismo valor (ej: Persona_001). Esto mantiene la consistencia de los datos y permite análisis significativos.',
    },
    {
      question: '¿Puedo anonimizar solo algunos campos?',
      answer: 'Sí, completamente. En el paso 2 puedes deseleccionar "Anonimizar TODAS las columnas" y elegir solo las que necesitas proteger.',
    },
    {
      question: '¿Qué formatos de archivo soporta?',
      answer: 'Actualmente soportamos CSV (.csv) y Excel (.xlsx, .xls). Los archivos pueden tener hasta 50MB de tamaño.',
    },
    {
      question: '¿Dónde se procesan los datos?',
      answer: '100% en tu computadora. No enviamos datos a ningún servidor. Puedes anonimizar información confidencial con total seguridad.',
    },
    {
      question: '¿Puedo recuperar los datos originales después?',
      answer: 'Solo si guardas el archivo de "mapeos". Los mapeos almacenan la relación original → anonimizado. Sin este archivo, la anonimización es irreversible (lo cual es más seguro).',
    },
    {
      question: '¿Cómo uso el archivo de mapeos?',
      answer: 'Guarda el JSON de mapeos de forma segura. Puedes cargar un mapeo anterior en futuras anonimizaciones para mantener consistencia con datos anteriores.',
    },
    {
      question: '¿Es rápido?',
      answer: 'Sí, está optimizado para procesar archivos grandes rápidamente. Un archivo con 10,000 filas suele procesarse en menos de 30 segundos.',
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  )

  const securityFeatures = [
    { icon: '🔒', title: 'Procesamiento Local', desc: 'Todo ocurre en tu computadora' },
    { icon: '🚫', title: 'Sin Cloud', desc: 'Datos nunca se envían a servidores' },
    { icon: '🔐', title: 'Sin Conexión', desc: 'Funciona offline completamente' },
    { icon: '✅', title: 'Open Source', desc: 'Código auditable y transparente' },
  ]

  const steps = [
    { num: 1, title: 'Carga tu archivo', desc: 'Arrastra un CSV o Excel con tus datos' },
    { num: 2, title: 'Selecciona columnas', desc: 'Elige qué información anonimizar' },
    { num: 3, title: 'Procesa', desc: 'El sistema detecta y reemplaza datos sensibles' },
    { num: 4, title: 'Descarga', desc: 'Obtén los datos anonimizados y mapeos' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white">
              ℹ️ Centro de Ayuda
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Encontrar respuestas rápidas a preguntas comunes
            </p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feature, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              ⚙️ Cómo Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      {step.num}
                    </div>
                    {step.num < 4 && (
                      <div className="hidden lg:block absolute top-5 left-10 w-12 h-0.5 bg-primary-600" style={{ width: 'calc(100% + 24px)' }} />
                    )}
                  </div>
                  <Card>
                    <CardContent className="pt-6 space-y-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              ❓ Preguntas Frecuentes
            </h2>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en FAQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      No se encontraron respuestas. Intenta otra búsqueda.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map((faq, i) => (
                  <Card
                    key={i}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === i ? null : i)
                    }
                  >
                    <div className="p-6 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
                          expandedFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    {expandedFaq === i && (
                      <CardContent className="border-t border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-400">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardHeader>
              <CardTitle className="text-primary-900 dark:text-primary-100">
                📧 ¿Necesitas Más Ayuda?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-primary-800 dark:text-primary-200">
                Si no encuentras lo que buscas, contáctanos a través de:
              </p>
              <ul className="space-y-2 text-primary-700 dark:text-primary-300">
                <li>• Email: support@anonimizador.com</li>
                <li>• GitHub: github.com/anonimizador</li>
                <li>• Documentación: docs.anonimizador.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

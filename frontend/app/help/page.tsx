'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/Card'
import {
  CheckCircle2,
  ChevronDown,
  CloudOff,
  HelpCircle,
  Lock,
  Search,
  ShieldCheck,
  WifiOff,
} from 'lucide-react'

const faqs = [
  {
    question: 'Que datos detecta automaticamente?',
    answer: 'El sistema detecta nombres propios, RUTs chilenos, emails, telefonos, ubicaciones, direcciones y organizaciones.',
  },
  {
    question: 'Como funciona la anonimizacion consistente?',
    answer: 'Si un mismo dato aparece varias veces, se reemplaza siempre por el mismo alias. Esto mantiene consistencia para analisis y trazabilidad.',
  },
  {
    question: 'Puedo anonimizar solo algunos campos?',
    answer: 'Si. En el paso 2 puedes elegir manualmente las columnas que contienen informacion sensible.',
  },
  {
    question: 'Que formatos de archivo soporta?',
    answer: 'Actualmente soporta CSV y Excel. Los archivos pueden tener hasta 50 MB.',
  },
  {
    question: 'Donde se procesan los datos?',
    answer: 'Todo ocurre en tu computadora. La herramienta esta pensada para trabajar sin enviar datos a servicios externos.',
  },
  {
    question: 'Puedo recuperar los datos originales despues?',
    answer: 'Solo si guardas el archivo de mapeos. Sin ese archivo, la anonimizacion queda irreversible.',
  },
]

const securityFeatures = [
  { Icon: Lock, title: 'Procesamiento local', desc: 'Todo ocurre en tu computadora', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300' },
  { Icon: CloudOff, title: 'Sin cloud', desc: 'Datos nunca salen del equipo', color: 'text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-300' },
  { Icon: WifiOff, title: 'Sin conexion', desc: 'Pensado para operar offline', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300' },
  { Icon: CheckCircle2, title: 'Auditable', desc: 'Flujo claro y verificable', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300' },
]

const steps = [
  { num: 1, title: 'Carga tu archivo', desc: 'Arrastra un CSV o Excel con tus datos.' },
  { num: 2, title: 'Selecciona columnas', desc: 'Elige que informacion proteger.' },
  { num: 3, title: 'Procesa', desc: 'Reemplaza los datos sensibles.' },
  { num: 4, title: 'Descarga', desc: 'Obtiene resultados y mapeos.' },
]

/**
 * Renderiza la pagina de ayuda del anonimizador.
 */
export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <Header />
      <main className="premium-page-bg min-h-0 overflow-x-hidden px-4 pb-5 pt-40 text-slate-950 dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1880px] space-y-8">
          <section className="premium-3d-panel-clean relative mx-auto w-full overflow-hidden rounded-2xl border border-cyan-100/70 bg-white/82 px-6 py-8 text-center shadow-[0_14px_42px_rgba(79,95,217,0.07)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/82 sm:px-10">
            <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-950/30" />
            <div className="absolute -bottom-28 right-1/4 h-60 w-60 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-950/30" />
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 text-white shadow-[0_8px_20px_rgba(79,95,217,0.16)]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h1 className="relative mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Centro de Ayuda
            </h1>
            <p className="relative mx-auto mt-2 max-w-2xl text-base font-medium text-slate-600 dark:text-slate-300">
              Respuestas rapidas para usar el anonimizador con confianza.
            </p>
          </section>

          <section className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((feature) => (
              <Card key={feature.title} className="premium-3d-card border-cyan-100/70 bg-white/82 text-center shadow-[0_16px_50px_rgba(79,95,217,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/82">
                <CardContent className="space-y-3 px-5 py-6">
                  <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-5 text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="space-y-5">
            <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
              Como funciona
            </h2>
            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="absolute left-0 right-0 top-[22px] hidden h-0.5 bg-gradient-to-r from-primary-600 via-blue-600 to-teal-500 lg:block" />
              {steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-600 text-sm font-black text-white shadow-[0_8px_18px_rgba(79,95,217,0.18)]">
                      {step.num}
                    </div>
                  </div>
                  <Card className="premium-3d-card border-cyan-100/70 bg-white/82 shadow-[0_16px_50px_rgba(79,95,217,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/82">
                    <CardContent className="space-y-2 px-6 py-6">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{step.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-3xl font-black text-slate-900 dark:text-white">
              <HelpCircle className="h-8 w-8 text-primary-600" />
              Preguntas frecuentes
            </h2>

            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en preguntas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-cyan-100/70 bg-white/82 py-3 pl-12 pr-4 text-slate-900 shadow-[0_12px_40px_rgba(79,95,217,0.08)] outline-none backdrop-blur-2xl focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-950/82 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <Card className="border-cyan-100/70 bg-white/82 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/82">
                  <CardContent className="pt-6 text-center text-slate-600 dark:text-slate-400">
                    No se encontraron respuestas. Intenta otra busqueda.
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <Card
                    key={faq.question}
                    className="premium-3d-card cursor-pointer border-cyan-100/70 bg-white/82 shadow-[0_12px_40px_rgba(79,95,217,0.07)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/82"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-4 p-5">
                      <h3 className="font-black text-slate-900 dark:text-white">{faq.question}</h3>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedFaq === index && (
                      <CardContent className="border-t border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {faq.answer}
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}



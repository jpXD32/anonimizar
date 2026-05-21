'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Shield,
  Lock,
  Zap,
  Database,
  Brain,
  CheckCircle2,
  ArrowRight,
  Globe
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Lock,
      title: '🔒 100% Local',
      description: 'Tu información nunca sale de tu computadora. Procesamiento completamente local sin conexión a nube.',
    },
    {
      icon: Brain,
      title: '🧠 NLP Inteligente',
      description: 'Detección automática de datos sensibles usando tecnología de procesamiento de lenguaje natural avanzada.',
    },
    {
      icon: Zap,
      title: '⚡ Súper Rápido',
      description: 'Procesa archivos grandes en segundos. Optimizado para máximo rendimiento y eficiencia.',
    },
    {
      icon: Database,
      title: '📊 Múltiples Formatos',
      description: 'Soporta CSV, Excel, XLSX y más. Importa y exporta en los formatos que necesites.',
    },
    {
      icon: Shield,
      title: '🛡️ Datos Consistentes',
      description: 'Anonimización consistente. Los mismos datos se reemplazan con los mismos valores en todo el archivo.',
    },
    {
      icon: Globe,
      title: '🌐 Sin Conexión',
      description: 'Funciona completamente sin internet. Ideal para entornos segmentados y sin acceso a red.',
    },
  ]

  const stats = [
    { label: 'Datos Procesados', value: '100M+' },
    { label: 'Usuarios Activos', value: '50K+' },
    { label: 'Archivos Anonimizados', value: '1M+' },
    { label: 'Uptime', value: '99.9%' },
  ]

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 h-full bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                    Versión 1.0 - Disponible Ahora
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                      Protege tus Datos
                    </span>
                    <br />
                    <span className="text-slate-900 dark:text-white">
                      100% Local
                    </span>
                  </h1>

                  <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                    Anonimiza información sensible de forma segura, rápida y sin enviar datos a la nube. Tecnología NLP inteligente para máxima privacidad.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asLink
                    href="/dashboard"
                    variant="primary"
                    size="lg"
                    className="group"
                  >
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    asLink
                    href="/help"
                    variant="outline"
                    size="lg"
                  >
                    Ver Documentación
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {[
                    { icon: Lock, text: 'Totalmente Privado' },
                    { icon: Shield, text: 'Sin Cloud' },
                    { icon: CheckCircle2, text: 'Open Source' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <badge.icon className="w-5 h-5 text-green-600" />
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative hidden lg:block h-96">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/20 to-accent-400/20 rounded-2xl blur-3xl animate-pulse-glow" />
                <div className="relative h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col justify-center shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-3 bg-slate-700 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-700 rounded-full w-1/2" />
                    <div className="space-y-2 pt-4">
                      <div className="h-2 bg-primary-500/30 rounded-full w-full" />
                      <div className="h-2 bg-primary-500/20 rounded-full w-5/6" />
                      <div className="h-2 bg-primary-500/10 rounded-full w-4/6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                ✨ Características Principales
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Todo lo que necesitas para anonimizar datos de forma segura y profesional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={i}
                    interactive
                    className="group"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900 transition-colors">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card gradient className="border-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-accent-700 text-white">
              <CardHeader>
                <CardTitle className="text-3xl sm:text-4xl text-white">
                  Listo para Anonimizar Tus Datos?
                </CardTitle>
                <CardDescription className="text-primary-100 mt-2">
                  Comienza ahora mismo. Es rápido, fácil y completamente seguro.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button
                  asLink
                  href="/dashboard"
                  variant="secondary"
                  size="lg"
                >
                  Ir al Dashboard
                </Button>
                <Button
                  asLink
                  href="/help"
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/20"
                >
                  Aprender Más
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

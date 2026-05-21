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
  Globe,
  Sparkles,
  TrendingUp,
  Users,
  Award
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Lock,
      title: '🔒 100% Local',
      description: 'Tu información nunca sale de tu computadora. Procesamiento completamente local sin conexión a nube.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: '🧠 NLP Inteligente',
      description: 'Detección automática de datos sensibles usando tecnología de procesamiento de lenguaje natural.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: '⚡ Súper Rápido',
      description: 'Procesa archivos grandes en segundos. Optimizado para máximo rendimiento.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Database,
      title: '📊 Multi-formato',
      description: 'Soporta CSV, Excel, XLSX y más. Importa y exporta en cualquier formato.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: '🛡️ Consistente',
      description: 'Los mismos datos se reemplazan con los mismos valores en todo el archivo.',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Globe,
      title: '🌐 Sin Conexión',
      description: 'Funciona completamente sin internet. Ideal para entornos segmentados.',
      color: 'from-teal-500 to-blue-500'
    },
  ]

  const stats = [
    { label: 'Datos Procesados', value: '100M+', icon: TrendingUp },
    { label: 'Usuarios Activos', value: '50K+', icon: Users },
    { label: 'Archivos', value: '1M+', icon: Database },
    { label: 'Confiabilidad', value: '99.9%', icon: Award },
  ]

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section - Premium */}
        <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-400/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-950/50 dark:to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-10 animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold border border-primary-200 dark:border-primary-800">
                  <Sparkles className="w-4 h-4" />
                  Versión 1.0 - Disponible Ahora
                </div>

                {/* Heading */}
                <div className="space-y-6">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight">
                    <span className="block gradient-text">
                      Protege tus
                    </span>
                    <span className="block text-slate-900 dark:text-white">
                      Datos 100% Local
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                    Anonimiza información sensible de forma segura, rápida y sin enviar datos a la nube. Tecnología NLP inteligente para máxima privacidad.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asLink
                    href="/dashboard"
                    variant="primary"
                    size="lg"
                    className="group text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <Button
                    asLink
                    href="/help"
                    variant="outline"
                    size="lg"
                    className="text-lg"
                  >
                    Ver Documentación
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                  {[
                    { icon: Lock, text: 'Totalmente Privado', color: 'text-emerald-600' },
                    { icon: Shield, text: 'Sin Cloud', color: 'text-blue-600' },
                    { icon: CheckCircle2, text: 'Open Source', color: 'text-purple-600' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800`}>
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {badge.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual - Premium Mockup */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 p-8 shadow-2xl card-glow">
                  {/* Window Header */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="flex-1 text-center text-xs text-slate-400">localhost:3000</div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg w-2/3" />
                    <div className="h-3 bg-slate-700 rounded-full w-full" />
                    <div className="h-3 bg-slate-700 rounded-full w-4/5" />
                    <div className="space-y-3 pt-6">
                      <div className="h-10 bg-slate-800 rounded-lg flex items-center px-3">
                        <div className="w-5 h-5 bg-slate-700 rounded mr-3" />
                        <div className="h-2 bg-slate-700 rounded w-32" />
                      </div>
                      <div className="h-10 bg-slate-800/50 rounded-lg flex items-center px-3">
                        <div className="w-5 h-5 bg-slate-700 rounded mr-3" />
                        <div className="h-2 bg-slate-700 rounded w-24" />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-700/50 flex gap-2">
                      <div className="h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex-1" />
                      <div className="h-8 bg-slate-700 rounded-lg flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Premium */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <div key={i} className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <StatIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section - Premium Grid */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-20">
              <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                ✨ Características <span className="gradient-text">Premium</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Todo lo que necesitas para anonimizar datos de forma segura, rápida y profesional
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={i}
                    interactive
                    className="group overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-2xl -mr-16 -mt-16`} />
                    <CardHeader>
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${feature.color.split('-')[1]}-500/30`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Premium */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl p-12 sm:p-16 lg:p-20">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 dark:from-primary-700 dark:via-primary-800 dark:to-accent-700" />
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                    Listo para Anonimizar
                  </h2>
                  <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                    Comienza ahora mismo. Es rápido, fácil y completamente seguro. Sin tarjeta de crédito requerida.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button
                    asLink
                    href="/dashboard"
                    variant="secondary"
                    size="lg"
                    className="text-lg font-semibold shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Ir al Dashboard
                  </Button>
                  <Button
                    asLink
                    href="/help"
                    variant="ghost"
                    size="lg"
                    className="text-lg font-semibold text-white hover:bg-white/20"
                  >
                    Aprender Más
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

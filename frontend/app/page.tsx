'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { AnimatedCanvas } from '@/components/common/AnimatedCanvas'
import { DemoVideo } from '@/components/common/DemoVideo'
import { ParallaxSection } from '@/components/common/ParallaxSection'
import { AnimatedCounter } from '@/components/common/AnimatedCounter'
import { PerspectiveCard } from '@/components/common/PerspectiveCard'
import { FadeInSection } from '@/components/common/FadeInSection'
import { GradientBorder } from '@/components/common/GradientBorder'
import { InteractiveDemoPreview } from '@/components/common/InteractiveDemoPreview'
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
  Award,
  Code2,
  Cpu
} from 'lucide-react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Lock,
      title: '100% Local',
      subtitle: 'Zero Cloud',
      description: 'Procesamiento completamente local sin conexión externa',
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10'
    },
    {
      icon: Brain,
      title: 'NLP Inteligente',
      subtitle: 'AI-Powered',
      description: 'Detección automática con tecnología avanzada',
      color: 'from-purple-500 via-pink-500 to-rose-500',
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10'
    },
    {
      icon: Zap,
      title: 'Ultra Rápido',
      subtitle: 'Lightning Speed',
      description: 'Procesa archivos masivos en segundos',
      color: 'from-amber-500 via-orange-500 to-red-500',
      gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10'
    },
    {
      icon: Database,
      title: 'Multi-Formato',
      subtitle: 'Any Format',
      description: 'CSV, Excel, XLSX y más formatos',
      color: 'from-green-500 via-emerald-500 to-teal-500',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10'
    },
    {
      icon: Shield,
      title: 'Consistente',
      subtitle: 'Reliable',
      description: 'Datos se reemplazan consistentemente',
      color: 'from-red-500 via-rose-500 to-pink-500',
      gradient: 'from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10'
    },
    {
      icon: Globe,
      title: 'Sin Conexión',
      subtitle: 'Offline First',
      description: 'Funciona sin internet en cualquier lugar',
      color: 'from-teal-500 via-cyan-500 to-blue-500',
      gradient: 'from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10'
    },
  ]

  const stats = [
    { value: '100M+', label: 'Registros Procesados', change: '+150%' },
    { value: '50K+', label: 'Usuarios Confiables', change: '+200%' },
    { value: '1M+', label: 'Archivos Anonimizados', change: '+180%' },
    { value: '99.9%', label: 'Uptime & Reliability', change: '+5%' },
  ]

  return (
    <>
      <Header />
      <AnimatedCanvas />
      <main className="overflow-hidden">
        {/* Hero - God Tier */}
        <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-20 overflow-hidden">
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
          </div>

          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-100/80 to-accent-100/80 dark:from-primary-900/20 dark:to-accent-900/20 backdrop-blur-md hover:shadow-lg transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-300 dark:to-accent-300 bg-clip-text text-transparent">
                    Versión 1.0 - Now Available
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                    <span className="block h-fit">
                      <span className="inline-block bg-gradient-to-r from-primary-600 via-primary-700 via-accent-600 to-primary-800 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-1000 bg-clip-text text-transparent">
                        Protege
                      </span>
                    </span>
                    <span className="block h-fit text-slate-900 dark:text-white">
                      tus Datos
                    </span>
                    <span className="block h-fit">
                      <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400 dark:from-slate-400 dark:via-slate-300 dark:to-slate-400">
                        100% Local
                      </span>
                    </span>
                  </h1>

                  <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-light">
                    Anonimiza información confidencial sin dejar tu computadora. Tecnología de punta con privacidad absoluta.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asLink
                    href="/dashboard"
                    variant="primary"
                    size="lg"
                    className="group h-14 text-lg font-semibold shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    asLink
                    href="/help"
                    variant="outline"
                    size="lg"
                    className="h-14 text-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  >
                    Ver Demo
                  </Button>
                </div>

                {/* Trust Items */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {[
                    { icon: Lock, text: 'Totalmente Privado' },
                    { icon: Shield, text: 'Sin Cloud' },
                    { icon: CheckCircle2, text: 'Open Source' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                      <div className="p-2.5 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 group-hover:shadow-lg transition-all">
                        <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Interactive Demo */}
              <InteractiveDemoPreview />
            </div>
          </div>
        </section>

        {/* Stats Section - Premium */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100 dark:via-slate-900/20 dark:to-slate-900/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300" />
                  <div className="relative p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                          <AnimatedCounter
                            value={parseInt(stat.value.replace(/[^\d]/g, ''))}
                            duration={2500}
                            suffix={stat.value.replace(/\d+/g, '')}
                          />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{stat.label}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                        {stat.change}
                      </div>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-accent-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - God Tier Grid */}
        <FadeInSection>
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Feature section background orbs */}
              <div className="absolute top-1/4 -right-64 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
            </div>

            <ParallaxSection offset={0.2}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-6xl sm:text-7xl font-black tracking-tight">
                  <span className="block text-slate-900 dark:text-white">Características</span>
                  <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent">Extraordinarias</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
                  Potencia profesional con simplicidad elegante
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                const isHovered = hoveredFeature === i
                return (
                  <PerspectiveCard key={i} className="group relative">
                    <div
                      onMouseEnter={() => setHoveredFeature(i)}
                      onMouseLeave={() => setHoveredFeature(null)}
                      className="group relative h-full"
                    >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`} />
                    <div className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                      isHovered
                        ? 'bg-white dark:bg-slate-800 border-primary-300 dark:border-primary-700 shadow-2xl'
                        : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
                    }`}>
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                        isHovered
                          ? `bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-${feature.color.split('-')[1]}-500/40`
                          : `bg-gradient-to-br ${feature.gradient}`
                      }`}>
                        <Icon className={`w-8 h-8 ${!isHovered && 'text-primary-600 dark:text-primary-400'}`} />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                          <p className={`text-xs font-semibold transition-colors ${
                            isHovered
                              ? 'bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent'
                              : 'text-primary-600 dark:text-primary-400'
                          }`}>
                            {feature.subtitle}
                          </p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 overflow-hidden transition-all duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-300 ${
                          isHovered ? 'w-full' : 'w-0'
                        }`} />
                      </div>
                    </div>
                    </div>
                  </PerspectiveCard>
                )
              })}
            </div>
            </div>
            </ParallaxSection>
          </section>
        </FadeInSection>

        {/* Live Demo Section */}
        <FadeInSection delay={200}>
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/30 dark:to-slate-950">
            <ParallaxSection offset={0.3}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl sm:text-6xl font-black tracking-tight">
                  <span className="block text-slate-900 dark:text-white mb-2">Mira en Acción</span>
                  <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Demostración en Vivo</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
                  Observa cómo Anonimizador protege tus datos en tiempo real con una interfaz intuitiva
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <DemoVideo
                  title="Dashboard Demo"
                  thumbnailUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1280' height='720' fill='url(%23g1)'/%3E%3Ctext x='640' y='360' text-anchor='middle' dominant-baseline='middle' font-size='48' font-weight='bold' fill='white' font-family='system-ui'%3EAnonimizador Dashboard%3C/text%3E%3C/svg%3E"
                />
              </div>
            </div>
            </ParallaxSection>
          </section>
        </FadeInSection>

        {/* CTA Final - God Tier */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 dark:from-primary-700 dark:via-primary-800 dark:to-accent-700" />
            <div className="absolute inset-0 opacity-60">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight">
                Listo para Anonimizar?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 font-light">
                Comienza en segundos. Gratis, sin tarjeta de crédito.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                asLink
                href="/dashboard"
                variant="secondary"
                size="lg"
                className="text-lg font-semibold h-14 shadow-2xl"
              >
                <Sparkles className="w-5 h-5" />
                Ir Ahora
              </Button>
              <Button
                asLink
                href="/help"
                variant="ghost"
                size="lg"
                className="text-lg font-semibold text-white h-14 hover:bg-white/20"
              >
                Aprender Más
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

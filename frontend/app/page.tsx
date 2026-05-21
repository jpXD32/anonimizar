'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { AnimatedCanvas } from '@/components/common/AnimatedCanvas'
import { InteractiveDemoPreview } from '@/components/common/InteractiveDemoPreview'
import { Lock, Shield, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
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
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  {[
                    { icon: Lock, text: 'Totalmente Privado' },
                    { icon: Shield, text: 'Sin Cloud' },
                    { icon: CheckCircle2, text: 'Open Source' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer text-center">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all">
                        <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
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
      </main>

      <Footer />
    </>
  )
}

'use client'

import { RefObject, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Indica si el usuario prefiere reducir movimiento en la interfaz.
 */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Crea la animacion inicial del encabezado.
 */
function createHeaderIntroTimeline(scope: HTMLElement): gsap.core.Timeline {
  const select = gsap.utils.selector(scope)

  return gsap.timeline({
    defaults: {
      duration: 0.78,
      ease: 'power3.out',
    },
  })
    .fromTo(
      scope,
      {
        y: -20,
        z: -90,
        rotationX: -8,
        transformPerspective: 900,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
      },
    )
    .fromTo(
      select('[data-header-animate]'),
      {
        y: 12,
        scale: 0.96,
      },
      {
        y: 0,
        scale: 1,
        stagger: {
          each: 0.08,
          from: 'center',
        },
      },
      '-=0.48',
    )
}

/**
 * Crea la animacion del encabezado vinculada al desplazamiento.
 */
function createHeaderScrollTween(scope: HTMLElement): ScrollTrigger {
  const surface = scope.querySelector('[data-header-surface]')

  return ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 260,
    scrub: 0.65,
    onUpdate: (self) => {
      gsap.to(surface, {
        y: self.progress * -5,
        scale: 1 - self.progress * 0.012,
        boxShadow: `0 ${18 + self.progress * 14}px ${48 + self.progress * 28}px rgba(15, 23, 42, ${0.08 + self.progress * 0.08})`,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    },
  })
}

/**
 * Entrega la referencia del encabezado y registra sus animaciones GSAP.
 */
export function useHeaderGsapAnimations(): RefObject<HTMLElement> {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const scope = headerRef.current

    if (!scope) {
      return undefined
    }

    if (prefersReducedMotion()) {
      gsap.set(scope, { clearProps: 'all' })
      return undefined
    }

    const introTimeline = createHeaderIntroTimeline(scope)
    const scrollTrigger = createHeaderScrollTween(scope)

    return () => {
      introTimeline.kill()
      scrollTrigger.kill()
    }
  }, { scope: headerRef })

  return headerRef
}

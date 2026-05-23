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
 * Crea la animacion de entrada del pie de pagina.
 */
function createFooterRevealTimeline(scope: HTMLElement): gsap.core.Timeline {
  const select = gsap.utils.selector(scope)

  return gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: 'top 88%',
      end: 'bottom bottom',
      toggleActions: 'play none none reverse',
    },
    defaults: {
      duration: 0.75,
      ease: 'power3.out',
    },
  })
    .fromTo(
      select('[data-footer-panel]'),
      {
        y: 34,
        z: -120,
        rotationX: -7,
        transformPerspective: 1000,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
      },
    )
    .fromTo(
      select('[data-footer-animate]'),
      {
        y: 18,
        scale: 0.96,
      },
      {
        y: 0,
        scale: 1,
        stagger: 0.07,
      },
      '-=0.42',
    )
    .fromTo(
      select('[data-footer-trust]'),
      {
        y: 20,
        z: -80,
        rotationX: -6,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
        stagger: {
          each: 0.06,
          from: 'center',
        },
      },
      '-=0.42',
    )
}

/**
 * Crea la animacion ambiental del pie de pagina.
 */
function createFooterAmbientTween(scope: HTMLElement): gsap.core.Tween {
  return gsap.to(scope.querySelector('[data-footer-orbit]'), {
    y: -8,
    x: 8,
    rotation: 4,
    duration: 2.4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })
}

/**
 * Entrega la referencia del pie de pagina y registra sus animaciones GSAP.
 */
export function useFooterGsapAnimations(): RefObject<HTMLElement> {
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const scope = footerRef.current

    if (!scope) {
      return undefined
    }

    if (prefersReducedMotion()) {
      gsap.set(scope, { clearProps: 'all' })
      return undefined
    }

    const revealTimeline = createFooterRevealTimeline(scope)
    const ambientTween = createFooterAmbientTween(scope)

    return () => {
      revealTimeline.kill()
      ambientTween.kill()
    }
  }, { scope: footerRef })

  return footerRef
}

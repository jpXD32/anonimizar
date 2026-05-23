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
 * Crea la animación inicial de entrada del hero.
 */
function createHeroIntroTimeline(scope: HTMLElement): gsap.core.Timeline {
  const select = gsap.utils.selector(scope)

  return gsap
    .timeline({
      defaults: {
        duration: 0.85,
        ease: 'power3.out',
      },
    })
    .fromTo(
      select('[data-hero-bg]'),
      {
        scale: 0.94,
        y: 20,
      },
      {
        scale: 1,
        y: 0,
      },
    )
    .fromTo(
      select('[data-hero-animate="badge"]'),
      {
        y: 18,
        z: -80,
        rotationX: -10,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
      },
      '-=0.45',
    )
    .fromTo(
      select('[data-hero-animate="title"] > span'),
      {
        y: 46,
        z: -120,
        rotationX: -14,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
        stagger: 0.1,
      },
      '-=0.35',
    )
    .fromTo(
      select('[data-hero-animate="copy"]'),
      {
        y: 24,
      },
      {
        y: 0,
      },
      '-=0.35',
    )
    .fromTo(
      select('[data-hero-animate="actions"] > *'),
      {
        y: 22,
        scale: 0.96,
      },
      {
        y: 0,
        scale: 1,
        stagger: 0.08,
      },
      '-=0.35',
    )
    .fromTo(
      select('[data-hero-animate="stat"]'),
      {
        y: 8,
        z: -90,
        rotationX: -8,
      },
      {
        y: 0,
        z: 0,
        rotationX: 0,
        stagger: 0.08,
      },
      '-=0.35',
    )
    .fromTo(
      select('[data-hero-demo]'),
      {
        x: 56,
        y: 18,
        z: -180,
        rotationY: -7,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        rotationY: 0,
      },
      '-=0.65',
    )
}

/**
 * Crea la animación del hero enlazada al desplazamiento vertical.
 */
function createHeroScrollTimeline(scope: HTMLElement): gsap.core.Timeline {
  const select = gsap.utils.selector(scope)

  return gsap.timeline({
    defaults: {
      ease: 'none',
    },
    scrollTrigger: {
      id: 'hero-scroll-depth',
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.85,
      invalidateOnRefresh: true,
    },
  })
    .to(select('[data-hero-bg]'), {
      y: -72,
      scale: 1.08,
      autoAlpha: 0.42,
      stagger: 0.04,
    }, 0)
    .to(select('[data-hero-animate="badge"]'), {
      y: -24,
      z: 70,
      rotationX: 8,
      autoAlpha: 0.84,
    }, 0)
    .to(select('[data-hero-animate="title"]'), {
      y: -58,
      z: 120,
      rotationX: 4,
      scale: 0.965,
      autoAlpha: 0.82,
    }, 0)
    .to(select('[data-hero-animate="copy"]'), {
      y: -42,
      autoAlpha: 0.48,
    }, 0)
    .to(select('[data-hero-animate="actions"]'), {
      y: -34,
      scale: 0.96,
      autoAlpha: 0.38,
    }, 0)
    .to(select('[data-hero-animate="stat"]'), {
      y: -22,
      z: 80,
      rotationX: 7,
      autoAlpha: 0.45,
      stagger: 0.02,
    }, 0)
    .to(select('[data-hero-demo]'), {
      y: 42,
      z: 120,
      rotationX: -2.5,
      rotationY: 2.5,
      scale: 0.985,
    }, 0)
}

/**
 * Entrega la referencia del hero y registra sus animaciones GSAP.
 */
export function useHeroGsapAnimations(): RefObject<HTMLElement> {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const scope = heroRef.current

    if (!scope) {
      return undefined
    }

    if (prefersReducedMotion()) {
      gsap.set(gsap.utils.selector(scope)('[data-hero-bg], [data-hero-animate], [data-hero-demo]'), {
        clearProps: 'all',
      })
      return undefined
    }

    const introTimeline = createHeroIntroTimeline(scope)
    let scrollTimeline: gsap.core.Timeline | undefined

    introTimeline.eventCallback('onComplete', () => {
      scrollTimeline = createHeroScrollTimeline(scope)
      ScrollTrigger.refresh()
    })

    return () => {
      introTimeline.kill()
      scrollTimeline?.kill()
    }
  }, { scope: heroRef })

  return heroRef
}

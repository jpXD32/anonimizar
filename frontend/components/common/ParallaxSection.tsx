'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export function ParallaxSection({
  children,
  offset = 0.5,
  className
}: ParallaxSectionProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const elementTop = rect.top
      const windowHeight = window.innerHeight

      // Only apply parallax when element is in view
      if (elementTop < windowHeight && elementTop > -rect.height) {
        const scrolled = window.scrollY
        const elementDistance = elementRef.current.offsetTop
        setTranslateY((scrolled - elementDistance + windowHeight) * offset)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return (
    <div
      ref={elementRef}
      style={{
        transform: `translateY(${translateY}px)`
      }}
      className={cn('transition-transform duration-75', className)}
    >
      {children}
    </div>
  )
}

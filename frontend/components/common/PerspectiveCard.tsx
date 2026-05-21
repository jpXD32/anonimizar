'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PerspectiveCardProps {
  children: React.ReactNode
  className?: string
}

export function PerspectiveCard({
  children,
  className = ''
}: PerspectiveCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * 5
    const rotateY = ((centerX - x) / centerX) * 5

    setMousePosition({ x: rotateY, y: rotateX })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovering(false)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
      className={cn('transition-transform duration-200', className)}
    >
      <div
        style={{
          transform: isHovering
            ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(1.05)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d' as const,
        }}
        className="transition-transform duration-200"
      >
        {children}
      </div>
    </div>
  )
}

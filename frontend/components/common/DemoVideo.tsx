'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'

interface DemoVideoProps {
  videoUrl?: string
  thumbnailUrl?: string
  title?: string
}

export function DemoVideo({
  videoUrl = 'https://player.vimeo.com/video/900000000',
  thumbnailUrl,
  title = 'Dashboard Demo'
}: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
      {/* Thumbnail/Poster */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600/20 via-accent-600/20 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-slate-300 font-medium">{title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300 z-10"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/50 group-hover:shadow-primary-500/80 group-hover:scale-110 transition-all duration-300">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
        </button>
      )}

      {/* Video Iframe */}
      {isPlaying && (
        <iframe
          src={`${videoUrl}?autoplay=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* Border Glow Effect */}
      <div className="absolute inset-0 rounded-2xl border border-primary-500/30 group-hover:border-primary-500/60 transition-all duration-300 pointer-events-none" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10 opacity-0 group-hover:opacity-100" />
    </div>
  )
}

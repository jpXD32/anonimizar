import { useCallback } from 'react'

export type SoundType = 'start' | 'progress' | 'complete' | 'error' | 'success'

export function useAudioFeedback(enabled: boolean = true) {
  const playSound = useCallback((type: SoundType) => {
    if (!enabled) return

    // Use Web Audio API to generate sounds without external files
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    switch (type) {
      case 'start':
        // Low beep - processing started
        playBeep(audioContext, 400, 0.1)
        break

      case 'progress':
        // Mid beep - progress update
        playBeep(audioContext, 600, 0.08)
        break

      case 'success':
        // Ascending beeps - completed successfully
        playBeep(audioContext, 500, 0.1)
        setTimeout(() => playBeep(audioContext, 700, 0.1), 100)
        setTimeout(() => playBeep(audioContext, 900, 0.15), 200)
        break

      case 'error':
        // Descending beeps - error occurred
        playBeep(audioContext, 800, 0.1)
        setTimeout(() => playBeep(audioContext, 600, 0.1), 100)
        setTimeout(() => playBeep(audioContext, 400, 0.15), 200)
        break

      case 'complete':
        // Pleasant chime - task completed
        playChime(audioContext)
        break
    }
  }, [enabled])

  return { playSound }
}

function playBeep(
  context: AudioContext,
  frequency: number,
  duration: number = 0.1
) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'

  gain.gain.setValueAtTime(0.3, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + duration)
}

function playChime(context: AudioContext) {
  const frequencies = [523.25, 659.25, 783.99] // Do, Mi, Sol chord
  const duration = 0.3

  frequencies.forEach((freq, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'sine'

    const startTime = context.currentTime + index * 0.05

    gain.gain.setValueAtTime(0.3, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  })
}

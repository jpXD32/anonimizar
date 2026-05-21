import { useMemo } from 'react'

export interface ProcessingMessage {
  title: string
  subtitle: string
  tips: string[]
  estimatedTime: number
}

export function useProcessingMessages(
  currentStep: 1 | 2 | 3 | 4,
  progress: number,
  totalRows?: number
) {
  return useMemo(() => {
    const messages: Record<number, ProcessingMessage> = {
      1: {
        title: '📤 Cargando archivo...',
        subtitle: 'Leyendo datos de tu computadora',
        tips: [
          'Archivos más grandes pueden tardar más',
          'Se soportan CSV y Excel',
          'Max 50 MB',
        ],
        estimatedTime: 3,
      },
      2: {
        title: '⚙️ Configurando anonimización...',
        subtitle: 'Preparando columnas y configuración',
        tips: [
          'Revisa las columnas seleccionadas',
          'Verifica que los datos se vean correctos',
          'Los mapeos te permitirán reutilizar configuración',
        ],
        estimatedTime: 5,
      },
      3: {
        title: '🧠 Anonimizando datos...',
        subtitle: 'Detectando y reemplazando información sensible',
        tips: [
          'Usando tecnología NLP avanzada',
          'Procesamiento 100% local',
          'No se envían datos a ningún servidor',
        ],
        estimatedTime: calculateEstimatedTime(totalRows || 0),
      },
      4: {
        title: '✅ Completado',
        subtitle: 'Tus datos están listos para descargar',
        tips: [
          'Descarga el archivo anonimizado',
          'Guarda los mapeos en lugar seguro',
          'Puedes reutilizar mapeos en futuras anonimizaciones',
        ],
        estimatedTime: 0,
      },
    }

    const message = messages[currentStep]

    // Calculate remaining time for step 3
    let remainingTime = message.estimatedTime
    if (currentStep === 3) {
      remainingTime = Math.max(
        Math.ceil((message.estimatedTime * (100 - progress)) / 100),
        0
      )
    }

    return {
      ...message,
      remainingTime,
      progress,
    }
  }, [currentStep, progress, totalRows])
}

function calculateEstimatedTime(totalRows: number): number {
  // Estimation: ~0.05 seconds per row
  // Minimum 5 seconds, maximum 120 seconds
  const estimated = Math.ceil(totalRows * 0.05)
  return Math.min(Math.max(estimated, 5), 120)
}

export const loadingTips = [
  '💡 Los datos nunca salen de tu computadora',
  '⚡ La anonimización es consistente en todo el archivo',
  '🔒 Los mapeos actúan como clave de recuperación',
  '📊 Puedes procesar archivos de cualquier tamaño',
  '🌍 100% funcionamiento offline',
  '✨ Soporta nombres, emails, RUTs, teléfonos y más',
]

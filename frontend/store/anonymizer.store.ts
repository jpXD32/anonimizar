import { create } from 'zustand'

export interface AnonymizerState {
  // File data
  uploadedFile: File | null
  fileData: any[][] | null
  fileColumns: string[]
  anonymizedData: any[][] | null

  // Configuration
  selectedColumns: string[]
  selectAll: boolean
  saveMappings: boolean
  previousMappings: Record<string, string> | null

  // UI State
  currentStep: 1 | 2 | 3 | 4
  isProcessing: boolean
  processingProgress: number
  processingStatus: string

  // Results
  statistics: {
    persons: number
    locations: number
    ruts: number
    emails: number
    phones: number
  }
  mappings: Record<string, string>
  error: string | null

  // Actions
  setFile: (file: File) => void
  setFileData: (data: any[][], columns: string[]) => void
  setSelectedColumns: (columns: string[]) => void
  setSelectAll: (value: boolean) => void
  setSaveMappings: (value: boolean) => void
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void
  startProcessing: () => void
  updateProgress: (progress: number, status: string) => void
  finishProcessing: (data: any[][], stats: any, mappings: Record<string, string>) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  uploadedFile: null,
  fileData: null,
  fileColumns: [],
  anonymizedData: null,
  selectedColumns: [],
  selectAll: true,
  saveMappings: true,
  previousMappings: null,
  currentStep: 1 as const,
  isProcessing: false,
  processingProgress: 0,
  processingStatus: '',
  statistics: {
    persons: 0,
    locations: 0,
    ruts: 0,
    emails: 0,
    phones: 0,
  },
  mappings: {},
  error: null,
}

export const useAnonymizerStore = create<AnonymizerState>((set) => ({
  ...initialState,

  setFile: (file) => set({ uploadedFile: file, currentStep: 1 }),

  setFileData: (data, columns) =>
    set({
      fileData: data,
      fileColumns: columns,
      selectedColumns: columns,
      currentStep: 2,
    }),

  setSelectedColumns: (columns) =>
    set({ selectedColumns: columns }),

  setSelectAll: (value) =>
    set((state) => ({
      selectAll: value,
      selectedColumns: value ? state.fileColumns : state.selectedColumns,
    })),

  setSaveMappings: (value) => set({ saveMappings: value }),

  setCurrentStep: (step) => set({ currentStep: step }),

  startProcessing: () =>
    set({
      isProcessing: true,
      processingProgress: 0,
      processingStatus: 'Iniciando procesamiento...',
      currentStep: 3,
    }),

  updateProgress: (progress, status) =>
    set({
      processingProgress: progress,
      processingStatus: status,
    }),

  finishProcessing: (data, stats, mappings) =>
    set({
      anonymizedData: data,
      statistics: stats,
      mappings,
      isProcessing: false,
      processingProgress: 100,
      processingStatus: 'Completado',
      currentStep: 4,
      error: null,
    }),

  setError: (error) => set({ error, isProcessing: false }),

  reset: () => set(initialState),
}))

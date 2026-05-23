import { create } from 'zustand'

export interface AnonymizerState {
  // File data
  uploadedFile: File | null
  fileData: any[][] | null
  fileColumns: string[]
  anonymizedData: any[][] | null
  resultDownloadId: string | null
  resultTruncated: boolean

  // Configuration
  selectedColumns: string[]
  selectAll: boolean
  saveMappings: boolean
  confidenceMode: 'conservative' | 'standard' | 'aggressive'
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
  setFileData: (data: any[][], columns: string[], file?: File) => void
  setSelectedColumns: (columns: string[]) => void
  setSelectAll: (value: boolean) => void
  setSaveMappings: (value: boolean) => void
  setConfidenceMode: (mode: 'conservative' | 'standard' | 'aggressive') => void
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void
  startProcessing: () => void
  updateProgress: (progress: number, status: string) => void
  finishProcessing: (
    data: any[][],
    stats: any,
    mappings: Record<string, string>,
    columns?: string[],
    resultDownloadId?: string | null,
    resultTruncated?: boolean
  ) => void
  setError: (error: string | null) => void
  clearSensitiveData: () => void
  reset: () => void
}

const initialState = {
  uploadedFile: null,
  fileData: null,
  fileColumns: [],
  anonymizedData: null,
  resultDownloadId: null,
  resultTruncated: false,
  selectedColumns: [],
  selectAll: false,
  saveMappings: true,
  confidenceMode: 'standard' as const,
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

  setFileData: (data, columns, file) =>
    set({
      uploadedFile: file || null,
      fileData: data,
      fileColumns: columns,
      anonymizedData: null,
      resultDownloadId: null,
      resultTruncated: false,
      mappings: {},
      selectedColumns: [],
      selectAll: false,
      previousMappings: null,
      statistics: initialState.statistics,
      error: null,
      currentStep: 2,
    }),

  setSelectedColumns: (columns) =>
    set({ selectedColumns: columns }),

  setSelectAll: (value) =>
    set((state) => ({
      selectAll: value,
      selectedColumns: value ? state.fileColumns : [],
    })),

  setSaveMappings: (value) => set({ saveMappings: value }),

  setConfidenceMode: (mode) => set({ confidenceMode: mode }),

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

  finishProcessing: (data, stats, mappings, columns, resultDownloadId = null, resultTruncated = false) =>
    set({
      anonymizedData: data,
      fileColumns: columns || [],
      resultDownloadId,
      resultTruncated,
      statistics: stats,
      mappings,
      isProcessing: false,
      processingProgress: 100,
      processingStatus: 'Completado',
      currentStep: 4,
      error: null,
    }),

  setError: (error) => set({ error, isProcessing: false }),

  clearSensitiveData: () =>
    set({
      uploadedFile: null,
      fileData: null,
      fileColumns: [],
      anonymizedData: null,
      resultDownloadId: null,
      resultTruncated: false,
      selectedColumns: [],
      selectAll: false,
      previousMappings: null,
      mappings: {},
      statistics: initialState.statistics,
      processingProgress: 0,
      processingStatus: '',
      isProcessing: false,
      currentStep: 1,
      error: null,
    }),

  reset: () => set(initialState),
}))

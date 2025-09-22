import { ImportedWord } from './import.types'

export interface ImporterOptions {
  isForTranscription: boolean
}

export interface Importer {
  getType(): string
  import(data: string, options?: ImporterOptions): Promise<ImportedWord[]>
}

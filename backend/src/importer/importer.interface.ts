import { ImportedWord } from './import.types'

export interface Importer {
  getType(): string
  import(data: string): Promise<ImportedWord[]>
}

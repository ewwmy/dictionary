import { ImportedWord } from './import.types'

export interface Importer {
  import(data: string, options?: any): Promise<ImportedWord[]>
}

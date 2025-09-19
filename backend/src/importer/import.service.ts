import { Injectable, Inject } from '@nestjs/common'
import { ImportedWord } from './import.types'
import { Importer } from './importer.interface'

@Injectable()
export class ImportService {
  constructor(@Inject('Importer') private readonly importer: Importer) {}

  async importFromText(data: string): Promise<ImportedWord[]> {
    return this.importer.import(data)
  }

  async importTranscriptionsFromText(data: string): Promise<ImportedWord[]> {
    return this.importer.import(data, { isForTranscription: true })
  }
}

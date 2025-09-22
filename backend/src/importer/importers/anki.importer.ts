import { Injectable } from '@nestjs/common'
import { Importer } from '../importer.interface'
import { ImportedWord } from '../import.types'
import { ImporterType } from '../importer-type.enum'

@Injectable()
export class AnkiImporter implements Importer {
  getType() {
    return ImporterType.Anki
  }

  async import(): Promise<ImportedWord[]> {
    return [{ word: 'anki-demo', translation: 'example' }]
  }
}

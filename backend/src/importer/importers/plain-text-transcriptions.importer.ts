import { Injectable } from '@nestjs/common'
import { Importer } from '../importer.interface'
import { ImportedWord } from '../import.types'
import { ImporterType } from '../importer-type.enum'

@Injectable()
export class PlainTextTranscriptionsImporter implements Importer {
  getType() {
    return ImporterType.PlainTextTranscriptions
  }

  async import(data: string): Promise<ImportedWord[]> {
    const lines = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    return lines.map((line): ImportedWord => {
      const [rawWord, rawDefinition] = line.split('—').map(s => s.trim())

      return {
        word: rawWord,
        transcriptionPhonetic: rawDefinition,
      }
    })
  }
}

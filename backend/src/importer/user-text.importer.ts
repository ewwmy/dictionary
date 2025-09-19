import { Injectable } from '@nestjs/common'
import { Importer } from './importer.interface'
import { ImportedWord } from './import.types'

@Injectable()
export class UserTextImporter implements Importer {
  async import(
    data: string,
    options: { isForTranscription: boolean } = { isForTranscription: false },
  ): Promise<ImportedWord[]> {
    const lines = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    return lines.map((line): ImportedWord => {
      const [rawWord, rawDefinition] = line.split('—').map(s => s.trim())

      if (options.isForTranscription) {
        return {
          word: rawWord,
          transcriptionPhonetic: rawDefinition,
        }
      } else {
        const wordMatches = rawWord.match(/(\w+)\s*\((\w+),\s*(\w+)\)/i)

        if (wordMatches) {
          return {
            word: wordMatches[1],
            word2: wordMatches[2],
            word3: wordMatches[3],
            translation: rawDefinition,
          }
        } else {
          return {
            word: rawWord,
            translation: rawDefinition,
          }
        }
      }
    })
  }
}

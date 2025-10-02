import { Injectable } from '@nestjs/common'
import { ImportedWord } from './import.types'
import { Importer } from './importer.interface'
import { PrismaService } from 'src/prisma/prisma.service'
import { ImporterType } from './importer-type.enum'
import { NoImporterFoundException } from './import.exceptions'
import { Constants } from 'src/constants/constants'
import { Prisma } from '@prisma/client'

@Injectable()
export class ImportService {
  constructor(
    private readonly importers: Importer[],
    private readonly prisma: PrismaService,
  ) {}

  async import(
    type: ImporterType,
    data: string,
    languageId: number,
  ): Promise<{ count: number }> {
    let affectedRows = 0

    const importer = this.importers.find(i => i.getType() === type)
    if (!importer) {
      throw new NoImporterFoundException(type)
    }

    const words: ImportedWord[] = await importer.import(data)

    if (!words.length) {
      return { count: 0 }
    }

    for (let i = 0; i < words.length; i += Constants.BATCH.SIZE) {
      const chunk = words.slice(i, i + Constants.BATCH.SIZE)

      const rows = chunk.map(
        w => Prisma.sql`
        (${languageId}, ${w.word}, ${w.word2}, ${w.word3}, ${w.translation}, ${w.transcriptionPhonetic})
      `,
      )

      await this.prisma.$transaction(async tx => {
        affectedRows += await tx.$executeRaw`
          INSERT INTO "words" ("language_id", "word", "word_v2", "word_v3", "translation", "transcription_phonetic")
          VALUES ${Prisma.join(rows)}
          ON CONFLICT ("language_id", "word") DO UPDATE
          SET "translation" = EXCLUDED."translation",
            "transcription_phonetic" = EXCLUDED."transcription_phonetic";`
      })
    }

    return { count: affectedRows }
  }
}

import { Injectable } from '@nestjs/common'
import { ImportedWord } from './import.types'
import { Importer } from './importer.interface'
import { PrismaService } from 'src/prisma/prisma.service'
import { ImporterType } from './importer-type.enum'
import {
  DuplicateWordDatabaseException,
  DuplicateWordImportException,
  NoImporterFoundException,
} from './import.exceptions'
import { Constants } from 'src/constants/constants'
import { Prisma } from '@prisma/client'
import { ImportOptions } from './import.options.type'
import { ImportOverwriteType } from './import.overwrite-types'

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
    options: ImportOptions,
  ): Promise<{ count: number }> {
    let affectedRows = 0

    const importer = this.importers.find(i => i.getType() === type)
    if (!importer) {
      throw new NoImporterFoundException(type)
    }

    let words: ImportedWord[] = await importer.import(data)

    if (!words.length) {
      return { count: 0 }
    }

    switch (options.overwriteType) {
      case ImportOverwriteType.Yes:
        words = Array.from(new Map(words.map(w => [w.word, w])).values())
        break
      case ImportOverwriteType.Merge:
        const mergedWords = words.reduce(
          (acc: ImportedWord[], cur: ImportedWord) => {
            const existingWord = acc.find(w => w.word === cur.word)
            if (existingWord) {
              existingWord.translation +=
                (options.mergeDelimiter ??
                  Constants.IMPORT.DEFAULT_MERGE_DELIMITER) + cur.translation
            } else {
              acc.push(cur)
            }
            return acc
          },
          [],
        )
        words = mergedWords
        break
      case ImportOverwriteType.Ignore:
        const firstOccurrenceWords = words.reduce(
          (acc: ImportedWord[], cur: ImportedWord) => {
            const existingWord = acc.find(w => w.word === cur.word)
            if (!existingWord) {
              acc.push(cur)
            }
            return acc
          },
          [],
        )
        words = firstOccurrenceWords
        break
      case ImportOverwriteType.Error:
        words.reduce((acc: Set<string>, cur: ImportedWord) => {
          if (acc.has(cur.word)) {
            throw new DuplicateWordImportException(cur.word)
          }
          acc.add(cur.word)
          return acc
        }, new Set())
        break
    }

    for (let i = 0; i < words.length; i += Constants.BATCH.SIZE) {
      const chunk = words.slice(i, i + Constants.BATCH.SIZE)

      const rows = chunk.map(
        w => Prisma.sql`
        (${languageId}, ${w.word}, ${w.word2}, ${w.word3}, ${w.translation}, ${w.transcriptionPhonetic})
      `,
      )

      switch (options.overwriteType) {
        case ImportOverwriteType.Yes:
          await this.prisma.$transaction(async tx => {
            affectedRows += await tx.$executeRaw`
              INSERT INTO "words" ("language_id", "word", "word_v2", "word_v3", "translation", "transcription_phonetic")
              VALUES ${Prisma.join(rows)}
              ON CONFLICT ("language_id", "word") DO UPDATE
              SET
                "word_v2" = EXCLUDED."word_v2",
                "word_v3" = EXCLUDED."word_v3",
                "translation" = EXCLUDED."translation",
                "transcription_phonetic" = EXCLUDED."transcription_phonetic";`
          })
          break
        case ImportOverwriteType.Merge:
          await this.prisma.$transaction(async tx => {
            affectedRows += await tx.$executeRaw`
              INSERT INTO "words" ("language_id", "word", "word_v2", "word_v3", "translation", "transcription_phonetic")
              VALUES ${Prisma.join(rows)}
              ON CONFLICT ("language_id", "word") DO UPDATE
              SET
                "word_v2" = EXCLUDED."word_v2",
                "word_v3" = EXCLUDED."word_v3",
                "translation" = concat(
                  "words"."translation",
                  ${Prisma.sql`${options.mergeDelimiter ?? Constants.IMPORT.DEFAULT_MERGE_DELIMITER}`},
                  EXCLUDED."translation"
                ),
                "transcription_phonetic" = EXCLUDED."transcription_phonetic";`
          })
          break
        case ImportOverwriteType.Ignore:
          await this.prisma.$transaction(async tx => {
            affectedRows += await tx.$executeRaw`
              INSERT INTO "words" ("language_id", "word", "word_v2", "word_v3", "translation", "transcription_phonetic")
              VALUES ${Prisma.join(rows)}
              ON CONFLICT ("language_id", "word") DO NOTHING;`
          })
          break
        case ImportOverwriteType.Error:
          try {
            await this.prisma.$transaction(async tx => {
              affectedRows += await tx.$executeRaw`
                INSERT INTO "words" ("language_id", "word", "word_v2", "word_v3", "translation", "transcription_phonetic")
                VALUES ${Prisma.join(rows)};`
            })
          } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              if (e.code === 'P2010') {
                const message = (e.meta?.message || '') as string
                const matches = message?.match(
                  /key\s+\(\w+,\s*word\)=\(\d+,\s*(\w+)\)\s*already exists/i,
                )
                if (matches) {
                  throw new DuplicateWordDatabaseException(matches[1])
                }
              }
            }
            throw e
          }
          break
      }
    }

    return { count: affectedRows }
  }
}

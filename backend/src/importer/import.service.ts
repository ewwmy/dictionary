import { Injectable } from '@nestjs/common'
import { ImportedWord } from './import.types'
import { Importer } from './importer.interface'
import { PrismaService } from 'src/prisma/prisma.service'
import { ImporterType } from './importer-type.enum'
import { NoImporterFoundException } from './import.exceptions'

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
    const importer = this.importers.find(i => i.getType() === type)
    if (!importer) {
      throw new NoImporterFoundException(type)
    }

    const words: ImportedWord[] = await importer.import(data)

    if (!words.length) {
      return { count: 0 }
    }

    return await this.prisma.word.createMany({
      data: words.map(word => ({
        ...word,
        languageId,
      })),
      skipDuplicates: true,
    })
  }
}

import { Module } from '@nestjs/common'
import { ImportService } from './import.service'
import { PlainTextImporter } from './importers/plain-text.importer'
import { AnkiImporter } from './importers/anki.importer'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    PlainTextImporter,
    AnkiImporter,
    {
      provide: ImportService,
      useFactory: (
        plainText: PlainTextImporter,
        anki: AnkiImporter,
        prisma: PrismaService,
      ) => new ImportService([plainText, anki], prisma),
      inject: [PlainTextImporter, AnkiImporter, PrismaService],
    },
  ],
  exports: [ImportService],
})
export class ImportModule {}

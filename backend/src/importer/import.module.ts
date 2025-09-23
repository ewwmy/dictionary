import { Module } from '@nestjs/common'
import { ImportService } from './import.service'
import { PlainTextImporter } from './importers/plain-text.importer'
import { AnkiImporter } from './importers/anki.importer'
import { PrismaService } from 'src/prisma/prisma.service'
import { PlainTextTranscriptionsImporter } from './importers/plain-text-transcriptions.importer'

@Module({
  providers: [
    PrismaService,
    PlainTextImporter,
    PlainTextTranscriptionsImporter,
    AnkiImporter,
    {
      provide: ImportService,
      useFactory: (
        plainText: PlainTextImporter,
        plainTextTranscriptions: PlainTextTranscriptionsImporter,
        anki: AnkiImporter,
        prisma: PrismaService,
      ) =>
        new ImportService([plainText, anki, plainTextTranscriptions], prisma),
      inject: [
        PlainTextImporter,
        PlainTextTranscriptionsImporter,
        AnkiImporter,
        PrismaService,
      ],
    },
  ],
  exports: [ImportService],
})
export class ImportModule {}

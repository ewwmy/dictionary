import { Module } from '@nestjs/common'
import { ImportService } from './import.service'
import { UserTextImporter } from './user-text.importer'

@Module({
  providers: [
    ImportService,
    {
      provide: 'Importer',
      useClass: UserTextImporter,
    },
  ],
  exports: [ImportService],
})
export class ImportModule {}

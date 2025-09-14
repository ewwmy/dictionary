import { Module } from '@nestjs/common'
import { WordsService } from './words.service'
import { WordsController } from './words.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { LanguagesModule } from 'src/languages/languages.module'

@Module({
  imports: [PrismaModule, LanguagesModule],
  providers: [WordsService],
  controllers: [WordsController],
})
export class WordsModule {}

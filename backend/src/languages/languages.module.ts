import { Module } from '@nestjs/common'
import { LanguagesService } from './languages.service'
import { LanguagesController } from './languages.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [LanguagesService],
  controllers: [LanguagesController],
})
export class LanguagesModule {}

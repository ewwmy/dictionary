import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AdminTokensController } from './admin.tokens.controller'
import { AdminTokensService } from './admin.tokens.service'

@Module({
  imports: [PrismaModule],
  providers: [AdminTokensService],
  controllers: [AdminTokensController],
})
export class AdminTokensModule {}

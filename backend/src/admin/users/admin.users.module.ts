import { Module } from '@nestjs/common'
import { AdminUsersService } from './admin.users.service'
import { AdminUsersController } from './admin.users.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [AdminUsersService],
  controllers: [AdminUsersController],
})
export class AdminUsersModule {}

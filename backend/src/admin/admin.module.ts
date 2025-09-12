import { Module } from '@nestjs/common'
import { AdminUsersModule } from './users/admin.users.module'
import { AdminTokensModule } from './tokens/admin.tokens.module'

@Module({
  imports: [AdminUsersModule, AdminTokensModule],
})
export class AdminModule {}

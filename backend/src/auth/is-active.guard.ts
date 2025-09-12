import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Messages } from 'src/messages/messages.const'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const user = req.user

    const dbUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!dbUser?.isActive) {
      throw new ForbiddenException(Messages.AUTH.PENDING_APPROVAL)
    }

    return true
  }
}

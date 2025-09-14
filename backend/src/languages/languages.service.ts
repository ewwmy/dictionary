import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Messages } from 'src/messages/messages.const'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCandidate(id: number, userId: number) {
    const candidate = await this.prisma.language.findUnique({
      where: {
        id,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.LANGUAGE.NOT_FOUND)
    }
    if (candidate.userId !== userId) {
      throw new ForbiddenException(Messages.LANGUAGE.FORBIDDEN)
    }
    return candidate
  }

  public async getAll(userId: number) {
    return this.prisma.language.findMany({
      where: {
        userId,
      },
    })
  }
}

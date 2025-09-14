import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Messages } from 'src/messages/messages.const'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCandidate(id: number, userId: number) {
    const candidate = await this.prisma.word.findUnique({
      where: {
        id,
      },
      include: {
        language: true,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.WORD.NOT_FOUND)
    }
    if (candidate.language.userId !== userId) {
      throw new ForbiddenException(Messages.WORD.FORBIDDEN)
    }
    return candidate
  }
}

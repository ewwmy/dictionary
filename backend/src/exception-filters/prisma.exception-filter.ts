import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Response } from 'express'

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        response.status(409).json({
          statusCode: 409,
          message: 'Unique constraint violation',
          target: exception.meta?.target,
        })
        break

      case 'P2003': // Foreign key constraint failed
        response.status(400).json({
          statusCode: 400,
          message: 'Foreign key constraint failed',
        })
        break

      default:
        response.status(500).json({
          statusCode: 500,
          message: 'Database error',
        })
        break
    }
  }
}

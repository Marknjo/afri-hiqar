import {
  EExceptionStatusCodes,
  EResStatus,
  TExceptionCollection,
} from '@lib/types/JsonRes'
import { HttpExceptionFilter } from './ExceptionHandler'

export class BadRequestException extends HttpExceptionFilter {
  statusCode = EExceptionStatusCodes.BAD_REQUEST

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, BadRequestException.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  serializeErrors(): TExceptionCollection {
    return [
      {
        status: EResStatus.FAILURE,
        statusCode: this.statusCode,
        data: {
          message: this.message,
        },
      },
    ]
  }
}

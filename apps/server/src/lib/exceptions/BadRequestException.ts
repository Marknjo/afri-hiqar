import {
  EExceptionStatusCodes,
  EResStatus,
  TExceptionCollection,
} from '@lib/types/JsonRes'
import { HttpExceptionFilter } from './ExceptionHandler'

export class BadRequestException extends HttpExceptionFilter {
  statusCode = EExceptionStatusCodes.BAD_REQUEST

  constructor(public message: string, code?: EExceptionStatusCodes) {
    super(message)

    if (code) {
      this.statusCode = code
    }

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

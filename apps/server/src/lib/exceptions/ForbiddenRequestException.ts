import {
  EExceptionStatusCodes,
  EResStatus,
  TExceptionCollection,
} from '@lib/types/JsonRes'

import { HttpExceptionFilter } from './ExceptionHandler'

export class ForbiddenRequestException extends HttpExceptionFilter {
  statusCode = EExceptionStatusCodes.REQUEST_FORBIDDEN

  constructor(
    public message: string = 'Your request is denied check your credentials, please!',
    code?: EExceptionStatusCodes,
  ) {
    super(message)

    if (code) {
      this.statusCode = code
    }

    Object.setPrototypeOf(this, ForbiddenRequestException.prototype)
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

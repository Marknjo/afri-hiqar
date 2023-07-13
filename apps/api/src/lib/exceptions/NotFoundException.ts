import {
  EExceptionStatusCodes,
  EResStatus,
  TExceptionCollection,
} from '@lib/types/JsonRes'

import { HttpExceptionFilter } from './ExceptionHandler'

export class NotFoundException extends HttpExceptionFilter {
  statusCode = EExceptionStatusCodes.NOT_FOUND

  constructor(public message: string = 'Not found') {
    super(message)

    Object.setPrototypeOf(this, NotFoundException.prototype)
  }

  serializeErrors(): TExceptionCollection {
    return [
      {
        status: EResStatus.NOT_FOUND,
        statusCode: this.statusCode,
        data: {
          message: this.message,
        },
      },
    ]
  }
}

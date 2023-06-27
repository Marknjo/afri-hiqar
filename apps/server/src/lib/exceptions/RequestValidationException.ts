import {
  EExceptionStatusCodes,
  EResStatus,
  IExceptionResponse,
  TExceptionCollection,
} from '@lib/types/JsonRes'

import { HttpExceptionFilter } from './ExceptionHandler'

export class RequestValidationException extends HttpExceptionFilter {
  public readonly statusCode = EExceptionStatusCodes.VALIDATION

  constructor(
    public errors: Pick<IExceptionResponse, 'data'>[],
    message: string = 'Invalid request parameters',
  ) {
    super(message)

    // Set prototype
    Object.setPrototypeOf(this, RequestValidationException.prototype)

    /// do not trace to this object
    Error.captureStackTrace(this, this.constructor)
  }

  serializeErrors(): TExceptionCollection {
    return this.errors.map(err => ({
      status: EResStatus.FAILURE,
      statusCode: this.statusCode,
      data: {
        message: err.data.message,
        field: err.data.message,
      },
    }))
  }
}

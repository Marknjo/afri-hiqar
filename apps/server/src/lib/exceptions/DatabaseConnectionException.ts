import { EExceptionStatusCodes, EResStatus } from '@lib/types/JsonRes'
import { HttpExceptionFilter } from './ExceptionHandler'

export class DatabaseConnectionException extends HttpExceptionFilter {
  public readonly statusCode = EExceptionStatusCodes.ERROR

  constructor(public message: string = 'Error connecting to database') {
    super(message)

    // Set prototype
    Object.setPrototypeOf(this, DatabaseConnectionException.prototype)

    /// do not trace to this object
    Error.captureStackTrace(this, this.constructor)
  }

  serializeErrors() {
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

import { NextFunction, Request, Response } from 'express'
import { HttpExceptionFilter } from '../exceptions/ExceptionHandler'
import {
  EExceptionStatusCodes,
  EResStatus,
  IExceptionResponse,
  TExceptionCollection,
} from '@lib/types/JsonRes'
import { isProd } from '@utils/env'

export default (
  err: Error,
  _req: Request,
  res: Response<
    { errors: TExceptionCollection | IExceptionResponse },
    Record<string, any>
  >,
  next: NextFunction,
) => {
  if (err instanceof HttpExceptionFilter) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() })
  }

  /// production error message handling
  if (isProd) {
    res.status(500).json({
      errors: [
        {
          status: EResStatus.ERROR,
          statusCode: EExceptionStatusCodes.ERROR,
          data: {
            message: 'Internal server error, Please try again',
          },
        },
      ],
    })
    return
  }

  /// Dev error message handling
  res.status(500).json({
    errors: [
      {
        status: EResStatus.ERROR,
        statusCode: EExceptionStatusCodes.ERROR,
        data: {
          message: 'Internal server error, Please try again',
          stack: err.stack,
        },
      },
    ],
  })
  next()
}

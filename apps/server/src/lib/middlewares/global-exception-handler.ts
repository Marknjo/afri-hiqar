import { NextFunction, Request, Response } from 'express'
import { HttpExceptionFilter } from '../exceptions/ExceptionHandler'

export default (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpExceptionFilter) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() })
  }

  res.status(500).json({
    errors: [
      {
        message: 'Internal server error, Please try again',
      },
    ],
  })

  next()
}

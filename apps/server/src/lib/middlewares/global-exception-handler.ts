import { NextFunction, Request, Response } from 'express'
import { HttpExceptionFilter } from '../exceptions/ExceptionHandler'
import {
  EExceptionStatusCodes,
  EResStatus,
  IExceptionResponse,
  TExceptionCollection,
} from '@lib/types/JsonRes'
import { isDev, isProd } from '@utils/env'
import { BadRequestException } from '@lib/exceptions/BadRequestException'

/**
 * Handles a broken JWT token
 * @returns
 */
const jwtTokenMalformedHandler = () => {
  // @TODO: A good place to implement serious login messages, and throttling and burning of the IP trying to access the resource.
  const message = 'Please login with valid credentials to access the resource'
  return new BadRequestException(message, 401)
}

/**
 * Handle expired JWT token Error
 * @returns Object of error message
 */
const jwtTokenExpiredHandler = () => {
  const message = `Your login session has expired. Please login again to access the route.`
  return new BadRequestException(message, 401)
}

export default (
  err: Error,
  _req: Request,
  res: Response<
    { errors: TExceptionCollection | IExceptionResponse },
    Record<string, any>
  >,
  next: NextFunction,
) => {
  console.log({ error: err.name })

  // Handler JWT Common errors
  if (err.name === 'TokenExpiredError') err = jwtTokenExpiredHandler()
  if (err.name === 'JsonWebTokenError') err = jwtTokenMalformedHandler()

  /// handle all errors except 500 types of errors

  if (
    err instanceof HttpExceptionFilter &&
    ((isProd && !String(err.statusCode).includes('5')) || isDev)
  ) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() })
  }

  /// production error generic message handler
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

  /// Handle all errors in production error message handling
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

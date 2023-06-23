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
import mongoose from 'mongoose'

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

/**
 * Mongoose Cast Error
 * @param err expected to be a mongoose error instance
 * @returns
 */
const invalidMongoIdFormatHandler = (
  err: mongoose.CastError,
): HttpExceptionFilter => {
  const message = `Received an invalid id format: ${err.value}`

  return new BadRequestException(message, 400)
}

/**
 * Handle Duplicate Key error message
 * @param err
 * @returns
 */
const duplicateUniqueIdErrorHandler = (
  err: mongoose.SyncIndexesError | any,
) => {
  const duplicateKey = err.keyValue.name
  const message = `Duplicate entry field detected (${duplicateKey}). Please use a unique name.`
  return new BadRequestException(message, 400)
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
  /* @ts-ignore */
  console.log({ error: err.name, ...err })

  // Handler JWT Common errors
  if (err.name === 'TokenExpiredError') err = jwtTokenExpiredHandler()
  if (err.name === 'JsonWebTokenError') err = jwtTokenMalformedHandler()

  /// handler mongo/mongoose errors
  if (err.name === 'CastError')
    err = invalidMongoIdFormatHandler(err as mongoose.CastError)

  /* @ts-ignore */
  if (err.code === 11000)
    err = duplicateUniqueIdErrorHandler(err as mongoose.SyncIndexesError | any)

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

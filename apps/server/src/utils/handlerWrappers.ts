import { NextFunction, Request, RequestHandler, Response } from 'express'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { TGenericRequestAsyncHandler } from '@lib/modules/handlersFactory'
/**
 * Wraps client side handlers, not wrapped with catchAsync, so as to push 500 errors to the global error handlers. Ensures, app never crashes.
 * @param next middleware next function
 * @param callback callback passed to the react
 * @returns Handler function rendered inside express handler
 */
export function handlerWrapper<T>(
  next: NextFunction,
  callback: (args?: Array<T>) => any,
) {
  try {
    return callback()
  } catch (error: unknown) {
    const err = error as { message: string }
    next(new BadRequestException(err.message, 500))
  }
}

export async function asyncHandlerWrapper<T>(
  next: NextFunction,
  callback: (args?: Array<T>) => Promise<any | void>,
  allowThrow: boolean = false,
) {
  try {
    return await callback()
  } catch (error: unknown) {
    if (allowThrow) throw error

    const err = error as { message: string }
    next(new BadRequestException(err.message, 500))
  }
}

export function asyncWrapper(fn: TGenericRequestAsyncHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as any, res, next).catch(next)
  }
}

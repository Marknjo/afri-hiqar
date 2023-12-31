import { Query, Model as HandlerModel } from 'mongoose'
import { NextFunction, Request, Response } from 'express'

import { asyncWrapper } from '@utils/handlerWrappers'
import { NotFoundException } from '@lib/exceptions/NotFoundException'
import { ICreateOneOptions, TGenericRequestHandler } from './types'

/**
 * Delete one general handler method
 *
 * @param Model The model implementing helper handler
 * @param options Passes filter options directly to the find, required modelName
 * @returns Response or error message to the http request
 */
export function deleteOne<T>(
  Model: Query<any, T> | HandlerModel<T>,
  options: ICreateOneOptions,
): TGenericRequestHandler {
  return asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get Id
      const id = req.params[`${options.modelName}Id`] // i.e tourId, userId

      // delete doc by the supplied id
      const doc = await (Model as HandlerModel<T>).findByIdAndDelete(id)

      if (!doc)
        throw new NotFoundException(
          `Could not delete ${options.modelName} with an id of ${id}`,
        )

      // Return the response
      res.status(204).json({
        status: 'success',
        message: options.message
          ? options.message
          : `${options.modelName} was deleted successfully`,
      })
    },
  )
}

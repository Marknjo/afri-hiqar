import { Query, Model as HandlerModel } from 'mongoose'
import { IGetOneOptions, TGenericRequestHandler } from './types'
import { NotFoundException } from '@lib/exceptions/NotFoundException'
import { asyncWrapper } from '@utils/handlerWrappers'
import { NextFunction, Request, Response } from 'express'

/**
 * Get One general handler method
 * @param Model The model implementing helper handler
 * @param options Passes filter options directly to the find, required modelName
 * @returns Response or error message to the http request
 */
export function getOne<T>(
  Model: Query<any, T> | HandlerModel<T>,
  options: IGetOneOptions,
): TGenericRequestHandler {
  return asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction) => {
      // setup id dynamically
      let id

      // Get Id -> currentId is set through the middleware - universal for any id holder
      if (req.currentId) {
        id = req.currentId
      } else {
        id = req.params[`${options.modelName}Id`] // i.e tourId, userId
      }

      // Prep Doc
      let query

      if (options.populateOptions) {
        query = (Model as Query<any, T>)
          .findById(id)
          .populate(options.populateOptions)
      } else {
        query = (Model as Query<any, T>).findById(id)
      }

      // Find document by the id
      const doc = await query

      // Return error if there is no doc with the requested ID
      if (!doc)
        throw new NotFoundException(
          `Could not find requested ${options.modelName}`,
        )

      // Return response
      res.status(200).json({
        status: 'success',
        data: {
          [options.modelName]: doc,
        },
      })
    },
  )
}

import { NextFunction, Request, Response } from 'express'
import { Query, Model as HandlerModel } from 'mongoose'

import { asyncWrapper } from '@utils/handlerWrappers'
import { filterRequiredFields } from '@utils/filterRequiredFields'
import { ICreateOneOptions, TGenericRequestHandler } from './types'
import { NotFoundException } from '@lib/exceptions/NotFoundException'

/**
/**
 * Update one general handler method
 *
 * @param Model The model implementing helper handler
 * @param options Passes filter options directly to the find, required modelName
 * @returns Response or error message to the http request
 */
export function updateOne<T>(
  Model: Query<any, T> | HandlerModel<T>,
  options: ICreateOneOptions,
): TGenericRequestHandler {
  return asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction) => {
      // check if there is a body filter options
      const { requiredFields, modelName } = options

      let body
      // Get doc body
      if (requiredFields) {
        // Filter the body
        body = filterRequiredFields(req.body, requiredFields)
      } else {
        body = req.body
      }

      // @TODO: support files upload

      // Get Id
      const id = req.params[`${modelName}Id`] // i.e tourId, userId

      // Update the tour from the supplied body -> return updated tour and runValidators
      const doc = await (Model as HandlerModel<T>).findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      })

      // Validate doc update
      if (!doc)
        throw new NotFoundException(
          `${modelName.charAt(0).toLocaleUpperCase()}${modelName.slice(
            1,
          )} update error`,
        )

      // Return success message to requester
      res.status(202).json({
        status: 'success',
        message: options.message
          ? options.message
          : `${options.modelName} was updated successfully`,
        data: {
          [modelName]: doc,
        },
      })
    },
  )
}

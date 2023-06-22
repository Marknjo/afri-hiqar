import { Query, Model as HandlerModel } from 'mongoose'

import { asyncWrapper } from '@utils/handlerWrappers'
import { filterRequiredFields } from '@utils/filterRequiredFields'
import { ICreateOneOptions, TGenericRequestHandler } from './types'
import { NextFunction, Request, Response } from 'express'

/**
 * Create one general handler method
 *
 * @param  Model The model implementing helper handler
 * @param  options Passes filter options directly to the find, required modelName
 * @returns Response or error message to the http request
 */
export function createOne<T>(
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
      //if(req.files || req.file) body[options.fileFieldName] = req.file.filename;

      // Save tour to db
      const doc = await (Model as HandlerModel<T>).create(body)

      // Return success message to requester
      res.status(201).json({
        status: 'success',
        message: options.message
          ? options.message
          : `A new ${options.modelName} was added successfully`,
        data: {
          [modelName]: doc,
        },
      })
    },
  )
}

import { asyncWrapper } from '@utils/handlerWrappers'
import { NextFunction, Request, Response } from 'express'
import { Query, Model as HandlerModel } from 'mongoose'
import { IGenericHandlerOption, TGenericHandler } from './types'
import FindFeatures from './findFeatures'

export function getAll<T>({
  Model,
  options,
}: {
  Model: Query<any, T> | HandlerModel<T>
  options: IGenericHandlerOption
}): TGenericHandler {
  return asyncWrapper(async function (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    // Implement advancedFindFeatures (filters, sort, fields, pagination)
    let findQuery

    if (options.optionalFilters || req.optionalFilters) {
      let filterBy

      if (options.optionalFilters) filterBy = options.optionalFilters
      if (req.optionalFilters) filterBy = req.optionalFilters

      findQuery = new FindFeatures<T>(
        (Model as Query<any, T>).find(filterBy),
        req.query,
      )
    } else {
      findQuery = new FindFeatures<T>(Model as HandlerModel<T>, req.query)
    }

    const features = findQuery.filterQuery().limitFields().sortBy().paginate()

    // Get all
    let data = await features.query

    // Get results before returning the no results response
    const results = data ? data.length : 0

    // If there is no data -> Send a message instead
    let message
    if (data.length === 0) {
      message = `There is no ${options.modelName} returned from this request`
    }

    res.status(200).json({
      status: 'success',
      results,
      data: {
        ...(data.length > 0 ? { [options.modelName]: data } : {}),
        ...(message ? { message } : {}),
      },
    })
  })
}

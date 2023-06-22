// SINGLE FEATURE HANDLERS

import {
  EModelNames,
  TGenericRequestHandler,
  createOne,
  getAll,
  getOne,
  updateOne,
} from '@lib/modules'
import { deleteOne } from '@lib/modules/deleteOne'
import Tour from '@models/tourModel'
import { ITour } from '@models/types'
import { asyncWrapper } from '@utils/handlerWrappers'
import { NextFunction, Request, Response } from 'express'

/**
 * BASIC CRUD HANDLERS
 */
export const getAllTours = getAll<ITour>({
  Model: Tour,
  options: {
    modelName: EModelNames.TOUR,
  },
})

export const getTour = getOne<ITour>(Tour, {
  modelName: 'tour',
  populateOptions: { path: 'reviews', select: 'review rating updatedAt' },
})

export const createTour = createOne<ITour>(Tour, { modelName: 'tour' })
export const updateTour = updateOne<ITour>(Tour, { modelName: 'tour' })
export const deleteTour = deleteOne<ITour>(Tour, { modelName: 'tour' })

/**
 * MIDDLEWARES
 */
//- Get Aliases - Pre get all custom filters

/**
 * Get top five Cheapest Tours - middleware filter
 */
export const getCheapestTours = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // construct query object
  const fields = {
    fields:
      'name,price,ratingsAverage,ratingsQuantity,duration,summary,difficulty,maxGroupSize',
  }
  const sort = { sort: 'price,ratingsAverage' }
  const limitFields = { limit: '5' }

  req.query = { ...fields, ...sort, ...limitFields }

  next()
}

/**
 * get top 5 Best rated tours - middleware filter
 */
export const getTopRatedTours = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // construct query object
  const fields = {
    fields:
      'name,price,ratingsAverage,ratingsQuantity,duration,summary,difficulty,maxGroupSize',
  }
  const sort = { sort: '-ratingsAverage,price' }
  const limitFields = { limit: '5' }

  req.query = { ...fields, ...sort, ...limitFields }

  next()
}

/**
 * ADVANCED QUERIES
 */
/// AGGREGATORS HANDLERS
/**
 * Implement get Tour Stats Grouped By Difficulty
 */
export const getToursStatsByDifficulty: TGenericRequestHandler = asyncWrapper(
  async (_req, res, _next) => {
    // Aggregation pipeline
    const stats = await Tour.aggregate([
      // Match by average rating
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },

      // Group by difficulty, avgPrice, maxPrice, minPrice, tQty, numTours
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          ratingsQty: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
          avgPrice: { $avg: '$price' },
          tours: { $push: { id: '$_id', name: '$name', price: '$price' } },
        },
      },

      // Sort by avgPrice
      {
        $sort: { avgPrice: -1 },
      },
    ])

    // Response
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    })
  },
)

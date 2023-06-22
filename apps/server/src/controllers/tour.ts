// SINGLE FEATURE HANDLERS

import { EModelNames, createOne, getAll, getOne, updateOne } from '@lib/modules'
import { deleteOne } from '@lib/modules/deleteOne'
import Tour from '@models/tourModel'
import { ITour } from '@models/types'
import { NextFunction, Request, Response } from 'express'

// BASIC CRUD HANDLERS
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

/// MIDDLEWARES
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

/// ADVANCED QUERIES

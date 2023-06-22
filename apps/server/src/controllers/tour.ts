// SINGLE FEATURE HANDLERS

import { BadRequestException } from '@lib/exceptions/BadRequestException'
import {
  EModelNames,
  TGenericRequestHandler,
  createOne,
  getAll,
  getOne,
  updateOne,
} from '@lib/modules'
import { deleteOne } from '@lib/modules/deleteOne'
import { EExceptionStatusCodes } from '@lib/types/JsonRes'
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
          tours: { $push: { slug: '$slug', name: '$name', price: '$price' } },
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

/**
 * Implement monthly plans for all tours within a given year
 */
export const getMonthlyPlans: TGenericRequestHandler = asyncWrapper(
  async (req, res, _next) => {
    // Get url params (Year)
    const year = req.params.year
    const isDigit = /^\d{4}$/.test(year)

    if (!isDigit && Number.isFinite(+year))
      throw new BadRequestException(
        `Year format not supported`,
        EExceptionStatusCodes.REQUEST_NOT_ACCEPTABLE,
      )

    // Aggregate tours based on the tour start Dates
    const stats = await Tour.aggregate([
      // Unwind by startDates,
      {
        $unwind: '$startDates',
      },

      // match tours by startDates
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-01`),
          },
        },
      },

      // Group By month numTours, tours,
      {
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          tours: { $push: { slug: '$slug', name: '$name', price: '$price' } },
        },
      },

      // sort by month,
      {
        $sort: { _id: 1 },
      },

      // limit by 2
    ])

    // Return response
    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    })
  },
)

/**
 * Advanced implementation of finding tours within a given distance
 * given coordinates and the unit (miles/km)
 */
export const getToursWithinARadius: TGenericRequestHandler = asyncWrapper(
  async (req, res, _next) => {
    // Get Params -> distance, center [lat,lag], unit [mi/km]
    const { distance, latlng, unit } = req.params

    // Validate each step
    // Validate existence
    if (!distance || !latlng || !unit)
      throw new BadRequestException(
        'Distance or center or unit values missing from the request',
      )

    // Validate unit type
    if (unit !== 'km' && unit !== 'mi')
      throw new BadRequestException('Invalid unit type provided')

    // Validate distance is a number
    if (!Number.isFinite(+distance))
      throw new BadRequestException('Distance must be a number')

    // Validate lat lng
    const [lat, lng] = latlng.split(',')

    if (!lat || !lng)
      throw new BadRequestException(
        'Latitude and longitude should be separated by comma (31.038635,-117.6199248)',
      )

    const isLatLngValidFormat =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
        latlng,
      )

    if (!isLatLngValidFormat)
      throw new BadRequestException(
        'Latitude and longitude not in a valid format!',
      )

    // radius
    const radius = unit === 'mi' ? +distance / 3963 : +distance / 6378

    // Geo Find query
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    })

    // Responses
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  },
)

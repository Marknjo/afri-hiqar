// SINGLE FEATURE HANDLERS
import { env } from 'process'

import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import sharp from 'sharp'

import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'
import { NotFoundException } from '@lib/exceptions/NotFoundException'
import {
  EModelNames,
  TGenericRequestHandler,
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from '@lib/modules/handlersFactory'
import { EExceptionStatusCodes } from '@lib/types/JsonRes'
import Tour from '@models/tourModel'
import { IReview, ITour } from '@models/types'
import { asyncWrapper } from '@utils/handlerWrappers'

/**
 * Handle Tour Images upload
 */

//- Create memory storage
const storage = multer.memoryStorage()

//- Filter acceptable file type. Only images type

const filterFileType = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Should only accept images
  if (!file.mimetype.startsWith('image'))
    return cb(new BadRequestException('File format not supported!'))

  // File acceptable
  cb(null, true)
}

//- Create upload
const upload = multer({
  storage,
  fileFilter: filterFileType,
})

//- Resize cover image
export const resizeImageUploads: TGenericRequestHandler = asyncWrapper(
  async (req, _res, next) => {
    // Test first it there are images in the request before trying to upload
    if (!req.files) return next()

    // Prep file names
    const coverImgFilenameFormat = `tour-${req.params.tourId}-cover.webp`
    const imagesFilenameFormat = (num: number) =>
      `tour-${req.params.tourId}-${num}.webp`

    /// Resize cover image and upload
    let imageBuffer

    // Images and cover image was supplied
    const imgFiles = req.files as {
      imageCover: Express.Multer.File[]
      images: Express.Multer.File[]
    }

    /// handle cover image
    if (imgFiles) imageBuffer = imgFiles.imageCover[0].buffer

    const imagesPublicURL = 'public/images/tours'
    const imgRatioWidth = 1333 // 2000
    const imgRationHeight = 888 // 1333

    // Extract file
    await sharp(imageBuffer)
      .resize(imgRatioWidth, imgRationHeight, {
        fit: 'cover',
      })
      .webp({ quality: 70, smartSubsample: true })
      .toFormat('webp')
      .toFile(`${imagesPublicURL}/${coverImgFilenameFormat}`)

    /// Save image cover to DB
    req.body.imageCover = coverImgFilenameFormat

    /// Resize tour images
    let imagesBag: Array<string> = []

    await Promise.all(
      imgFiles.images.map(async (img, idx) => {
        // Add image to the images bug
        const filename = imagesFilenameFormat(idx + 1)

        imagesBag.push(filename)

        // Resize images
        await sharp(img.buffer)
          .resize(imgRatioWidth, imgRationHeight)
          .webp({ quality: 70, smartSubsample: true })
          .toFormat('webp')
          .toFile(`${imagesPublicURL}/${filename}`)
      }),
    )

    // Add images to the body and pass it to the next middleware (update | create)
    req.body.images = imagesBag

    // Next
    next()
  },
)

/**
 *
 * Middleware to implement on the create tour and update tour handlers
 * Handle File Upload, 3 images and 1 cover image
 */
export const uploadTourImages: TGenericRequestHandler = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'imageCover', maxCount: 1 },
])

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
/**
 * Prevent deleting a tour if a tour has a review -> Prevent orphans reviews
 */
export const preTourDeletion: TGenericRequestHandler = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    // find a tour by the delete id and populate reviews
    const tour = await Tour.findById(req.params.tourId).populate<{
      reviews: Array<IReview>
    }>({
      path: 'reviews',
      select: 'review',
    })

    // Prevent delete if the tour has reviews
    if (tour && tour.reviews.length > 0)
      throw new ForbiddenRequestException(
        `This tour has ${tour.reviews.length} reviews. Delete them before trying again.`,
      )

    // next
    next()
  },
)

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

/// Custom Queries

/**
 * Get A Tour Page Handler
 */
export const getTourBySlug: TGenericRequestHandler = asyncWrapper(
  async (req, res, next) => {
    // Get tour slug
    const slug = req.params.slug

    /// skip when it is tourId used to fetch a tour
    if (mongoose.isValidObjectId(slug)) {
      return next()
    }

    // Find tour by slug
    const tour = await Tour.findOne({ slug }).populate({
      path: 'reviews',
      select: 'review rating updatedAt',
    })

    // Handle not found tour
    if (!tour) {
      const title = slug.split('-').join(' ')
      throw new NotFoundException(
        `Tour ${title.charAt(0).toLocaleUpperCase()}${title.slice(
          1,
        )} not found in collection`,
      )
    }

    // Render overview page
    res.status(200).json({
      status: 'success',
      data: {
        tour,
        mapboxKey: env.MAPBOX_KEY,
        stripePublicKey: env.STRIPE_PUBLIC_KEY,
      },
    })
  },
)

/// AGGREGATORS HANDLERS

/**
 * Implement get Tour Stats Grouped By Difficulty
 */
export const getToursStatsByDifficulty: TGenericRequestHandler = asyncWrapper(
  async (_req: Request, res: Response, _next: NextFunction) => {
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
  async (req: Request, res: Response, _next: NextFunction) => {
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

/**
 * Advanced implementation of finding tours nearest to a given location
 *
 */
export const getToursNearLocation: TGenericRequestHandler = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    // get the longitude
    const { limit, latlng, unit } = req.params

    if (!latlng && !unit)
      throw new BadRequestException(
        'The request must include the your location and unit of choice(mi/km)',
      )

    if (!Number.isFinite(+limit))
      throw new BadRequestException('Limit must be a number')

    // Validate unit type
    if (unit !== 'km' && unit !== 'mi')
      throw new BadRequestException('Invalid unit type provided')

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
        EExceptionStatusCodes.REQUEST_NOT_ACCEPTABLE,
      )

    // Configure
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    // Create the aggregation
    const tours = await Tour.aggregate([
      // GEO WITHIN
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },

      // Project - distance, name,
      {
        $project: { name: 1, distance: 1, price: 1, maxGroupSize: 1 },
      },

      // set limit
      {
        $limit: limit ? +limit : 10,
      },

      // Sort ascending order
      {
        $sort: { distance: 1 },
      },
    ])

    // Return the response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  },
)

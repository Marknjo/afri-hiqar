// IMPORT DEPENDENCIES
// 3rd Party
import mongoose, { Model } from 'mongoose'

// local

import { IReview, ITour, IUser } from './types'
import Tour from './tourModel'

// DECLARE SCHEMA & MODEL
const { Schema, model } = mongoose

/// Types

interface IReviewModel extends Model<IReview> {
  build(attrs: IReview): IReview
  calculateRatingsQuantityAndAverage(tour: ITour): void
}

// DEFINE SCHEMA
const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    // Define Review
    review: {
      type: String,
      required: [true, 'A review must have a body'],
      trim: true,
    },

    // Define Tour
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have a tour'],
    },

    // Define User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.'],
    },

    // Define ratings
    rating: {
      type: Number,
      required: [true, 'A review must have a rating declared.'],
      min: [1, 'A rating must be above 1'],
      max: [5, 'A rating must be below 5'],
    },
  },
  {
    // Allow Timestamp
    timestamps: true,

    // Set Virtuals
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

// SET INDEXES
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

// DECLARE VIRTUALS

// DEFINE MIDDLEWARES
// STATIC METHOD

/**
 * Auto-update tour average ratings and ratings quantity based on provided user review rating
 * @param tourId Tour Id
 * @returns undefined
 */

reviewSchema.statics.calculateRatingsQuantityAndAverage = async function (
  tourId,
) {
  // Aggregate
  const stats = await this.aggregate([
    // Match tour by tourId
    {
      $match: { tour: tourId },
    },

    // Group by _id: tour, nRatings, avgRatings
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ])

  // Update tour based on the stats
  // If Aggregate is not empty
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].nRatings,
    })

    return
  }

  // If aggregate is empty
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: 4.5,
    ratingsQuantity: 0,
  })

  return
}

// PRE MIDDLEWARE
/**
 * Populate user details for all find query
 */
reviewSchema.pre(/^find/, function (next) {
  // Only populate users
  /* @ts-ignore */
  this.populate({
    path: 'user',
    select: 'name role photo',
  })

  // next
  next()
})

// POST MIDDLEWARE

/**
 * Update ratings for when creating or savings
 */
reviewSchema.post('save', function () {
  // Update the tour ratings

  /* @ts-ignore */
  this.constructor.calculateRatingsQuantityAndAverage(this.tour)
})

/**
 * Update ratings for when updating and deleting a review
 */
reviewSchema.post(/^findOneAnd/, function (doc, next) {
  // Update the tour ratings
  doc.constructor.calculateRatingsQuantityAndAverage(doc.tour)

  // Next
  next()
})

reviewSchema.statics.build = (attrs: IReview) => {
  return new Review(attrs)
}

// DEFINE METHODS

// CREATE MODEL
const Review = model<IReview, IReviewModel>('Review', reviewSchema)

// EXPORT MODEL
export default Review

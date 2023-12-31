// IMPORT DEPENDENCIES
// 3rd Party
import mongoose, { Model } from 'mongoose'
import slugify from 'slugify'

import { ITour, IUser } from './types'

// DECLARE SCHEMA & MODEL
const { model, Schema } = mongoose

interface ITourMethods extends Model<ITour> {
  comparePassword(password: string, hashedPassword: string): Promise<boolean>
  checkPasswordWasChangedAfterTokenIssue(tokenWasIssuedAt: number): boolean
}

interface ITourModel extends Model<ITour, {}, ITourMethods> {
  build(attrs: ITour): ITour
}

// DEFINE SCHEMA
// FIELDS: name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, startDates, description, summary, imageCover, images, locations, startLocations, guides
const tourSchema = new Schema<ITour, ITourModel, ITourMethods>(
  {
    // Define Name
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A tour must have a name'],
      maxlength: [50, 'A tour name must be less than 50 characters'],
      minlength: [10, 'A tour name must be above 10 characters'],
    },

    // Sets tour to be active
    active: {
      type: Boolean,
      default: true,
    },

    // Name Slug
    slug: String,

    // Define tour viewing restrictions
    restriction: {
      type: String,
      default: 'free',
      enum: {
        values: ['free', 'private', 'premium'],
        message: 'A tour restrictions can be either free, private or premium',
      },
    },

    // Define Duration
    duration: {
      type: Number,
      min: [1, 'A tour duration must be above 1 day'],
      required: [true, 'A must have a duration set'],
    },

    // Define maxGroupSize
    maxGroupSize: {
      type: Number,
      min: [1, 'A tour group size must at least have one member'],
      required: [true, 'A tour must have a maximum group size declared'],
    },

    // Define difficulty
    difficulty: {
      type: String,
      default: 'easy',
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'A tour difficulty level can only be either easy, medium or difficulty.',
      },
    },

    // Define ratingsAverage
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour rating can only be above one'],
      max: [5, 'A tour rating can only be either 5 or below 5'],
    },

    // Define ratingsQuantity
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [
        0,
        'A tour rating quantity can only be a positive number either 0 or above',
      ],
    },

    // Define price
    price: {
      type: Number,
      min: [0, 'A tour price can only be above 0'],
      required: [true, 'A tour must have a price declared'],
    },

    // Price discount
    priceDiscount: {
      type: Number,
      default: 0,
      min: [0, 'A tour price can only be above 0'],
      validate: {
        validator: function (val: number) {
          return val <= (this as unknown as ITour).price
        },
        message:
          'You entered a discount of {VALUE}, however price discount cannot be above the tour price',
      },
    },

    // Define startDates
    startDates: {
      type: [Date],
      required: [true, 'A tour must have start dates set'],
    },

    // Define tour Description
    description: String,

    // Define tour summary
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
    },

    // Define imageCover
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover defined'],
    },

    // Define images
    images: [String],

    // @TODO: Implementation slotsBooked
    // Define tour guides
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Define locations
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // Define startLocation
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    // Enable virtual fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    // Enable timestamps
    timestamps: true,
  },
)

// SET INDEXES
tourSchema.index({ startLocation: '2dsphere' })

// DECLARE VIRTUALS

/**
 * Calculate durations weeks
 */
tourSchema.virtual('durationWeeks').get(function () {
  if (!this.duration) return undefined

  return this.duration / 7
})

/**
 * Add virtual fields for reviews (parent referencing fix)
 */
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
})

// DEFINE MIDDLEWARES
// PRE - slugify tour names
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Allow guides to populate of loading the model
tourSchema.pre(/^find/, function (next) {
  /* @ts-ignore */
  this.populate<{ guides: IUser }>({
    path: 'guides',
    select: 'name role photo',
  })

  next()
})

// DEFINE METHODS
tourSchema.statics.build = (attrs: ITour) => {
  return new Tour(attrs)
}

// CREATE MODEL
const Tour = model<ITour, ITourModel>('Tour', tourSchema)

// EXPORT MODEL
export default Tour

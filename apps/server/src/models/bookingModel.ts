/// IMPORTS
import mongoose, { Model } from 'mongoose'
import { IBooking } from './types'

/// PREP SCHEMA AND MODEL
const { model, Schema } = mongoose

interface IBookingModel extends Model<IBooking> {
  build(attrs: IBooking): IBooking
}

/// DEFINE BOOKING SCHEMA
const bookingSchema = new Schema<IBooking, IBookingModel>(
  {
    // Tour Field
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'tour',
      required: [true, 'A booking must be associated to a tour'],
    },

    // User Field
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'A booking must be associated to a user'],
    },

    // Agent Field
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    // Price Field
    price: {
      type: Number,
      required: [true, 'A booking must have a price value'],
      min: [1, 'A booking price must be at least a dollar or above'],
    },

    // Discount Field
    discount: {
      type: Number,
      default: 0,

      validate: {
        validator: function (val: number): boolean {
          return val <= (this as unknown as IBooking).price
        },
        message: 'Discount can only be below the price of a booking amount',
      },
    },

    // Payment Method Field
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cash', 'm-pesa'],
      message:
        'Payment method not acceptable. We only accept payments via Stripe, M-Pesa, or cash via our lead agents',
    },

    // Payment Status Field
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

/// INDEXES
bookingSchema.index({ tour: 1, user: 1 })
bookingSchema.index({ agent: 1 })

/// MIDDLEWARES\
/**
 * Populate User and Tour on find query
 */
bookingSchema.pre(/^Find/, function (next) {
  /* @ts-ignore */
  this.populate('user').populate({
    path: 'tour',
    select: 'name imageCover slug',
  })

  next()
})

bookingSchema.statics.build = (attrs: IBooking) => {
  return new Booking(attrs)
}

/// DEFINE MODEL
const Booking = model<IBooking, IBookingModel>('Booking', bookingSchema)

Booking.build = (attrs: IBooking) => {
  return new Booking(attrs)
}

/// EXPORT BOOKING MODEL
export default Booking

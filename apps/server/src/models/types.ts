import { Document, Types } from 'mongoose'

/**
 * Booking Sharable Types
 */
export interface IBooking extends Document {
  tour: Types.ObjectId
  user: Types.ObjectId
  agent: Types.ObjectId
  price: number
  discount: number
  paymentMethod: string
  paid: boolean
}

export interface IPopulatedBooking {
  user: IUser | null
  tour: IUser | null
}

/**
 * Review Sharable Types
 */
export interface IReview extends Document {
  review: string
  tour: Types.ObjectId
  user: Types.ObjectId
  rating: number
}

/**
 * Tours Sharable Types
 */
export interface ILocation {
  type: string
  coordinates: [number]
  address: string
  description: string
  day: number
}

export interface ITour extends Document {
  name: string
  active: boolean
  slug: string
  restriction: string
  duration: number
  maxGroupSize: number
  difficulty: string
  ratingsAverage: number
  ratingsQuantity: number
  price: number
  priceDiscount: number
  startDates: Array<number>
  description: string
  summary: string
  imageCover: string
  images: Array<string>
  guides: Types.DocumentArray<Types.ObjectId>
  locations: Array<ILocation>
  startLocation: Omit<ILocation, 'day'>
}

/**
 * Users Sharable Types
 */
export interface IUser extends Document {
  name: string
  email: string
  role: Array<UserRoles> | string
  active: boolean
  accountConfirmed: boolean
  photo: string
  password: string
  passwordConfirm?: string
  passwordUpdatedAt: number
  passwordResetToken: string
  passwordResetTokenExpiresIn: string
}

export enum UserRoles {
  ADMIN = 'admin',
  LEAD_GUIDE = 'lead-guide',
  GUIDE = 'guide',
  USER = 'user',
  GUEST = 'guest',
}

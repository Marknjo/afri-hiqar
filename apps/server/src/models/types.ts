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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}

/**
 * Users Sharable Types
 */
export interface IUser extends Document {
  name: string
  email: string
  role: Array<EUserRoles> | string
  active: boolean
  accountConfirmed: boolean
  photo: string
  password: string
  passwordConfirm?: string
  passwordUpdatedAt: number
  passwordResetToken: string
  passwordResetTokenExpiresIn: string
  createdAt: string
  updatedAt: string
}

export interface IApi extends Document {
  user: Types.ObjectId
  isDefault: boolean // default api app consumer only one
  accountConfirmed: boolean // whether user of the account has confirmed it
  active: boolean // whether api key is expired or not
  apiKey: string
  apiExpiresAt: string // when api expires - date
  createdAt: string
  updatedAt: string
}

export enum EUserRoles {
  ADMIN = 'admin',
  LEAD_GUIDE = 'lead-guide',
  GUIDE = 'guide',
  USER = 'user',
  GUEST = 'guest',
}

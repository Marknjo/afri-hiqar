/// TEMPLATE FOR MODEL
// IMPORT DEPENDENCIES
// Global

// 3rd Party
import mongoose, { Model } from 'mongoose'
import bcrypt from 'bcryptjs'

import { IApi, IUser } from './types'

// DECLARE SCHEMA & MODEL
const { model, Schema } = mongoose

// Validations

interface IApiMethods extends Model<IApi> {
  compareApiKey(bareKey: string, hashedKey: string): Promise<boolean>
}

interface IApiModel extends Model<IApi, {}, IApiMethods> {
  build(attrs: IApi): IApi
}

// DEFINE SCHEMA
const apiSchema = new Schema<IApi, IApiModel, IApiMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Must be logged in to add a new API key'],
    },
    apiKey: {
      type: String,
      unique: true,

      trim: true,
      required: [true, 'Error Generating your API key'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    accountConfirmed: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    apiExpiresAt: Date,
  },
  {
    // Allow time stamps
    timestamps: true,

    // Allow virtual fields
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

/**
 * Hash token on saving data
 */
apiSchema.pre('save', async function (next) {
  // check if password field is modified
  if (!this.isModified('apiKey')) return next()

  // hash apiKey 12
  this.apiKey = await bcrypt.hash(this.apiKey, 12)

  // next middleware
  next()
})

apiSchema.pre(/^find/, function (next) {
  /* @ts-ignore */
  this.populate<{ user: IUser }>({
    path: 'user',
    select: 'id name email photo',
  })

  next()
})

//// METHODS

/**
 * Query Method Compare API Keys
 * @param bareKey API plain secret key
 * @param hashedKey Hashed key stored in the DB
 * @returns Whether a key test passes or not
 */
apiSchema.methods.compareApiKey = async function (bareKey, hashedKey) {
  return await bcrypt.compare(bareKey, hashedKey)
}

apiSchema.statics.build = (attrs: IApi) => {
  return new Api(attrs)
}

// CREATE MODEL
const Api = model<IApi, IApiModel>('Api', apiSchema)

// EXPORT MODEL
export default Api

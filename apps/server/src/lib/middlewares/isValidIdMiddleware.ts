import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { NextFunction, Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const isValidIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // Guard Clause for checking if a tour ID is supplied
  let id
  let modelName

  const tourId = req.params.tourId
  const userId = (id = req.params.userId)
  const reviewId = (id = req.params.reviewId)

  if (tourId) {
    id = tourId
    modelName = 'tour'
  }

  if (userId) {
    id = userId
    modelName = 'user'
  }

  if (reviewId) {
    id = reviewId
    modelName = 'review'
  }

  if (!isValidObjectId(id))
    throw new BadRequestException(`Please provide a valid ${modelName} id.`)

  // Assign tour Id to the request
  tourId && (req.tourId = id)
  userId && (req.userId = id)

  next()
}

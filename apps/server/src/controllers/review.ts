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
import Review from '@models/reviewModel'
import { IReview } from '@models/types'
import { asyncWrapper } from '@utils/handlerWrappers'

/// MIDDLEWARES HANDLERS

/**
 * Check if there is a review belonging to the current user is trying to find
 *
 * Check is the current user has the requested review
 */
export const checkIfUserHasTheReview: TGenericRequestHandler = asyncWrapper(
  async (req, _res, next) => {
    if (!req.user)
      throw new BadRequestException(
        'You do not have permission to access this route',
        EExceptionStatusCodes.REQUEST_FORBIDDEN,
      )

    // Return review
    const review = await Review.find({
      _id: req.params.reviewId,
      user: req.user.id,
    })

    // Show error to user trying to access a review not theirs
    if (req.user.role === 'user' && review.length === 0)
      throw new BadRequestException(
        'You do not have permissions to perform this action. You can only vew those review you have submitted.',
        EExceptionStatusCodes.REQUEST_FORBIDDEN,
      )

    next()
  },
)

// CRUD HANDLERS
/**
 * Basic CRUDS
 */
export const getAllReviews = getAll<IReview>({
  Model: Review,
  options: {
    modelName: EModelNames.REVIEW,
  },
})

export const getReview = getOne<IReview>(Review, { modelName: 'review' })
export const createReview = createOne<IReview>(Review, { modelName: 'review' })
export const updateReview = updateOne<IReview>(Review, { modelName: 'review' })
export const deleteReview = deleteOne<IReview>(Review, { modelName: 'review' })

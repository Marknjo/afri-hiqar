// SINGLE FEATURE HANDLERS

import { EModelNames, createOne, getAll, getOne, updateOne } from '@lib/modules'
import { deleteOne } from '@lib/modules/deleteOne'
import Review from '@models/reviewModel'
import { IReview } from '@models/types'

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

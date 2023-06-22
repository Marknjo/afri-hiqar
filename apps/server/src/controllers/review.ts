// SINGLE FEATURE HANDLERS

import { EModelNames, getAll, getOne } from '@lib/modules'
import { createOne } from '@lib/modules/createOne'
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

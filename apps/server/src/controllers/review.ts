// SINGLE FEATURE HANDLERS

import { EModelNames, getAll, getOne } from '@lib/modules'
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
}) as () => void

export const getReview = getOne(Review, { modelName: 'review' })

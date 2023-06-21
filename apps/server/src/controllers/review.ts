// SINGLE FEATURE HANDLERS

import { EModelNames, getAll } from '@lib/modules'
import Review from '@models/reviewModel'
import { IReview } from '@models/types'

// CRUD HANDLERS
/**
 * Get All Reviews
 */
export const getAllReviews = getAll<IReview>({
  Model: Review,
  options: {
    modelName: EModelNames.REVIEW,
  },
}) as () => void

// SINGLE FEATURE HANDLERS

import { EModelNames, getAll, getOne } from '@lib/modules'
import { createOne } from '@lib/modules/createOne'
import Tour from '@models/tourModel'
import { ITour } from '@models/types'
import { NextFunction, Request } from 'express'

// CRUD HANDLERS
/**
 * Get All Tours
 */
export const getAllTours = getAll<ITour>({
  Model: Tour,
  options: {
    modelName: EModelNames.TOUR,
  },
}) as () => void

export const getTour = getOne<ITour>(Tour, {
  modelName: 'tour',
  populateOptions: { path: 'reviews', select: 'review rating updatedAt' },
})

export const createTour = createOne<ITour>(Tour, { modelName: 'tour' })

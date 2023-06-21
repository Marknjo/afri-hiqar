// SINGLE FEATURE HANDLERS

import { EModelNames, getAll } from '@lib/modules'
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

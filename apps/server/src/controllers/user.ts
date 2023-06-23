// SINGLE FEATURE HANDLERS

import { NextFunction, Request, Response } from 'express'
import {
  EModelNames,
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from '@lib/modules/handlersFactory'
import User from '@models/userModel'
import { IUser } from '@models/types'

// CRUD HANDLERS
/**
 * Login In User Routes
 */

/// Get my profile
export const getMe = (req: Request, _res: Response, next: NextFunction) => {
  // Auto set id from the request
  req.currentId = req.user!.id

  // next
  next()
}

/**
 * Admin Only Routes
 */
export const getAllUsers = getAll<IUser>({
  Model: User,
  options: {
    modelName: EModelNames.USER,
  },
})

export const getUser = getOne<IUser>(User, { modelName: 'user' })

export const createUser = createOne<IUser>(User, {
  modelName: 'user',
})
export const updateUser = updateOne<IUser>(User, { modelName: 'user' })
export const deleteUser = deleteOne<IUser>(User, { modelName: 'user' })

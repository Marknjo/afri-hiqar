// SINGLE FEATURE HANDLERS

import { EModelNames, getAll, getOne } from '@lib/modules'
import User from '@models/userModel'
import { IUser } from '@models/types'
import { createOne } from '@lib/modules/createOne'

// CRUD HANDLERS
/**
 * Get All Users
 */
export const getAllUsers = getAll<IUser>({
  Model: User,
  options: {
    modelName: EModelNames.USER,
  },
}) as () => void

export const getUser = getOne<IUser>(User, { modelName: 'user' }) as () => void

export const createUser = createOne<IUser>(User, {
  modelName: 'user',
})

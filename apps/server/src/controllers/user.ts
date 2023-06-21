// SINGLE FEATURE HANDLERS

import { EModelNames, getAll } from '@lib/modules'
import User from '@models/userModel'
import { IUser } from '@models/types'

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

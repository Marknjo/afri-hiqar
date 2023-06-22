// SINGLE FEATURE HANDLERS

import { EModelNames, createOne, getAll, getOne, updateOne } from '@lib/modules'
import User from '@models/userModel'
import { IUser } from '@models/types'
import { deleteOne } from '@lib/modules/deleteOne'

// CRUD HANDLERS
/**
 * Get All Users
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

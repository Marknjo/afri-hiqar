// SINGLE FEATURE HANDLERS

import { NextFunction, Request, Response } from 'express'
import {
  EModelNames,
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  TGenericRequestHandler,
} from '@lib/modules/handlersFactory'
import User from '@models/userModel'
import { IUser } from '@models/types'
import { asyncWrapper } from '@utils/handlerWrappers'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { filterRequiredFields } from '@utils/filterRequiredFields'
import { signTokenAndSendResponse } from '@lib/modules/auth/helpers'

// CRUD HANDLERS
/**
 * Login In User CRUDS
 */

//- Get my profile
export const getMe = (req: Request, _res: Response, next: NextFunction) => {
  // Auto set id from the request
  req.currentId = req.user!.id

  // next
  next()
}

//- Update self
export const updateMe: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // Prevent updating user passwords using this method
    if (req.body.password || req.body.passwordConfirm)
      throw new BadRequestException(
        'Please use update my password section instead.',
      )

    // Get user data from the body
    const userUpdateData = req.body
    const userRequiredFields = ['name', 'email', 'active']

    // Filter unwanted fields
    const filteredUserData = filterRequiredFields<
      Pick<IUser, 'name' | 'email' | 'active' | 'photo'>
    >(userRequiredFields, userUpdateData)

    // Check if user has submitted their photo -> then upload
    // @TODO: Implement uploading user photo
    //if (req.file) filteredUserData.photo = req.filename;

    // update user details
    const user = await User.findByIdAndUpdate(req.user!.id, filteredUserData, {
      new: true,
      runValidators: true,
    })

    if (!user)
      throw new BadRequestException(
        'Updating your details failed. If this problem persists, please contact the administrator of this site.',
        500,
      )

    // Return success message
    res.status(200).json({
      status: 'success',
      message: 'Your account has been successfully updated',
      data: {
        user,
      },
    })
  },
)

//- Update my password
export const updateMyPassword: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // Check if user has supplied password
    const { password, passwordConfirm, passwordCurrent, remember } = req.body

    if (!password && !passwordConfirm && !passwordCurrent)
      throw new BadRequestException(
        'Please provide your current password and your new password',
      )

    // Find user by the ID
    const foundUser = (await User.findById(req.user!.id).select('+password'))!

    // compared password
    const passwordCompare = await foundUser.comparePassword(
      passwordCurrent,
      foundUser.password,
    )

    if (!passwordCompare)
      throw new BadRequestException(
        'Current Password input field failed! Enter a valid current password.',
      )

    // Save user info
    foundUser.password = password
    foundUser.passwordConfirm = passwordConfirm

    await foundUser.save()

    // Update user password -> signTokenAndReturn response;
    signTokenAndSendResponse(req, res, {
      user: foundUser,
      message: 'Your password update was successful',
      remember: !!remember,
    })
  },
)

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

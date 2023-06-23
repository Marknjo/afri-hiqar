import { asyncWrapper } from '@utils/handlerWrappers'
import { TGenericRequestHandler } from '../handlersFactory'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { EExceptionStatusCodes } from '@lib/types/JsonRes'
import User from '@models/userModel'
import { IUser } from '@models/types'
import { signTokenAndSendResponse } from './helpers'

/**
 * User Login
 */
export const login: TGenericRequestHandler = asyncWrapper(async (req, res) => {
  // Get their password and email address
  const { password, email, remember } = req.body

  // check if remember is set
  const rememberUser = remember && remember === '1' ? true : false

  // Check if they are send by user
  if (!password && !email)
    throw new BadRequestException('Email and Password not supplied')

  // Find user by the email address
  const foundUser = await User.findOne({ email }).select('+password')

  // Validate existence and compare user password
  //comparePassword
  if (
    !foundUser ||
    !(await foundUser.comparePassword(password, foundUser.password))
  )
    throw new BadRequestException(
      'Email or password invalid',
      EExceptionStatusCodes.REQUEST_UNAUTHORIZED,
    )

  // Remove stale fields (password reset) from database if found
  if (foundUser.passwordResetToken) {
    const useData: Partial<IUser> = foundUser

    // Remove these fields from the DB
    useData.passwordResetToken = undefined
    useData.passwordResetTokenExpiresIn = undefined
    await foundUser.save({ validateBeforeSave: false })
  }

  // If available signTokenAndSendResponse
  await signTokenAndSendResponse(req, res, {
    user: foundUser,
    remember: rememberUser,
    message: 'You have successfully logged in. Welcome to AfriHiqar Again.',
  })
})

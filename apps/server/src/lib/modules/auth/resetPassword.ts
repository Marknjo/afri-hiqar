import crypto from 'crypto'

import { asyncWrapper } from '@utils/handlerWrappers'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import User from '@models/userModel'

import { TGenericRequestHandler } from '../handlersFactory'
import { IUser } from '@models/types'
import { signTokenAndSendResponse } from './helpers'

/**
 * Reset user password handler
 */
export const resetPassword: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // Ensure user has submitted password and passwordConfirm and Token
    const { password, passwordConfirm } = req.body

    // Get user reset token
    const { token } = req.params

    if (!password || !passwordConfirm || !token)
      throw new BadRequestException(
        'Password reset requires a new password, a password confirmation, and a reset token. Please ensure all three are provided before sending a new request!',
      )

    // hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Get user by token and whose password expires is greater than now
    // Ensure the reset token has not expired first
    const foundUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresIn: { $gte: new Date(Date.now()) },
    })

    // Find user by email and hashed token
    if (!foundUser)
      throw new BadRequestException(
        'You are receiving this error because we could not find user belonging to the supplied password reset token or your password reset session has expired. Try resetting your password again and respond within the first 10 minutes.',
        401,
      )

    // Save new password
    foundUser.password = password
    foundUser.passwordConfirm = passwordConfirm

    const optionUser = foundUser as Partial<IUser>
    optionUser.passwordResetToken = undefined
    optionUser.passwordResetTokenExpiresIn = undefined

    await foundUser.save()

    // Update user password updated At done from the model on save middleware()

    // If everything is fine, sign token and send response -> send user to dashboard
    signTokenAndSendResponse(req, res, {
      user: optionUser,
      remember: false,
      message: 'Password was reset successfully. Welcome back to AfriHiqar😊',
    })
  },
)

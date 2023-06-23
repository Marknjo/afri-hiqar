import { env } from 'process'

import { asyncWrapper } from '@utils/handlerWrappers'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import User from '@models/userModel'
import { EExceptionStatusCodes } from '@lib/types/JsonRes'
import { isDev } from '@utils/env'

import { TGenericRequestHandler } from '../handlersFactory'
import Email from '../email/emailsHandler'
import { IUser } from '@models/types'

/**
 * Forget user password handler
 */
export const forgetPassword: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // Get user email from the body
    const { email } = req.body

    if (!email)
      throw new BadRequestException(
        'Please add you valid email to your request',
      )

    // Find user based on the email address
    const foundUser = await User.findOne({ email })

    // Verify user before trying to create the token
    if (!foundUser)
      throw new BadRequestException(
        'Sorry, we could not find user with that email in this server. Please use the email you logged in with to send this request again.',
        EExceptionStatusCodes.REQUEST_UNAUTHORIZED,
      )

    // Valid user, generate the password reset token and update database entries
    const resetToken = foundUser.createPasswordResetToken()
    await foundUser.save({ validateBeforeSave: false })

    // Try sending the reset token to user via email address
    try {
      // rest url @TODO: Update client url
      const resetUrl = isDev
        ? `${env.APP_CLIENT_URL_DEV!}/reset-password/${resetToken}`
        : `${env.APP_CLIENT_URL_PROD!}/reset-password/${resetToken}`

      // Message @FIXME: Remove after implementing pug template

      await new Email({
        recipient: {
          email: foundUser.email,
          name: foundUser.name,
        },
        url: resetUrl,
        payload: { token: resetToken },
      }).sendPasswordReset()

      /// Set message flash message
      // If sending email == success, send a success message
      res.status(200).json({
        status: 'success',
        data: {
          message:
            'Password reset token was sent to your email address. Please ensure to reset the password within the next 10 minutes.',
        },
      })
    } catch (error) {
      // If fail, remove the password reset token, and expiresIn from the DB
      const optionUser = foundUser as Partial<IUser>
      optionUser.passwordResetToken = undefined
      optionUser.passwordResetTokenExpiresIn = undefined

      await foundUser.save({ validateBeforeSave: false })

      // Send a 500 error
      throw new BadRequestException(
        'Error sending the email, please try again later.',
        500,
      )
    }
  },
)

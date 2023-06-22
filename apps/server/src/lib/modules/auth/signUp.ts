import { env } from 'process'

import { asyncWrapper } from '@utils/handlerWrappers'
import { filterRequiredFields } from '@utils/filterRequiredFields'
import User from '@models/userModel'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { HttpExceptionFilter } from '@lib/exceptions/ExceptionHandler'
import { isDev } from '@utils/env'

import { signTokenAndSendResponse } from './helpers'
import { TFilteredRequiredFields } from './types'
import { TGenericRequestHandler } from '../handlersFactory'
import Email from '../email/emailsHandler'

/**
 * SignUp user
 */
export const signup: TGenericRequestHandler = asyncWrapper(
  async (req, res, next) => {
    // Get user data

    const requiredFields = [
      'name',
      'remember',
      'email',
      'password',
      'passwordConfirm',
    ]

    // filter unwanted fields
    const filteredFields = filterRequiredFields<TFilteredRequiredFields>(
      requiredFields,
      req.body,
    )

    // Create user fields
    const user = await User.create(filteredFields)

    // if successful in sending welcome email & account confirmation
    try {
      ///  @TODO: in future emailing as a cron job for faster processing of signup
      const url = isDev
        ? `${req.protocol}://${req.hostname}:${env.APP_PORT}`
        : `${req.protocol}://${req.hostname}`

      // Try to send email
      await new Email({
        recipient: {
          email: user.email,
          name: user.name,
        },
        url,
      }).sendWelcomeMessage()

      /// send account confirm email
      await new Email({
        recipient: {
          email: user.email,
          name: user.name,
        },
        url,
      }).sendConfirmAccount()

      // Send a successful response -> signTokenAndSendResponse
      const rememberUser =
        filteredFields.remember && filteredFields.remember === '1'
          ? true
          : false

      await signTokenAndSendResponse(req, res, {
        user,
        remember: rememberUser,
      })
      return
    } catch (error) {
      // If fails sending the email do not create user -> remove them by the id
      await User.deleteOne({ _id: user.id })

      if (error instanceof HttpExceptionFilter) {
        return next(error)
      }
      // Send error
      throw new BadRequestException(
        'Error sending welcome email. Please try again later to create your account.',
        500,
      )
    }
  },
)

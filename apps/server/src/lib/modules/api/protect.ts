import { promisify } from 'util'
import { env } from 'process'
import jwt from 'jsonwebtoken'

import { asyncWrapper } from '@utils/handlerWrappers'
import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'
import User from '@models/userModel'

import { TGenericRequestHandler } from '../handlersFactory'

/**
 * Protect routes (Login users access) middleware
 */
export const protect: TGenericRequestHandler = asyncWrapper(
  async (req, res, next) => {
    // Get authorization token from the header or cookie
    const apiKey = req.headers['x-api-key']

    // If no token, send error message
    if (!apiKey)
      throw new ForbiddenRequestException(
        'You are trying to access a protected resource. Please login or create an account to access AfriHiqar API.',
      )

    // Verify token (get iat and user id) (@TODO: handle JWT error messages via global error)
    const jwtRes = (await promisify<string, jwt.Secret>(jwt.verify)(
      jwtToken,
      env.JWT_SECRET!,
    )) as unknown as jwt.JwtPayload

    const { id: userId, iat } = jwtRes

    // Find user by user id and verify
    // @TODO: implement prevent access of routes if user account is not activated after 24 hours of registering the account.
    const foundUser = await User.findById(userId)

    if (!foundUser || !foundUser.active)
      throw new ForbiddenRequestException(
        'Access to this resource denied. We could not verify your credentials. Please login again.',
      )

    if (!foundUser.accountConfirmed && req.path !== '/confirm-account')
      throw new ForbiddenRequestException(
        'Looks like you are trying to access this resource account unverified credentials. Please check your email to verify your for verification.',
      )

    // Compare time token was created and now
    const isValidSession = foundUser.checkPasswordWasChangedAfterTokenIssue(
      iat!,
    )

    if (!isValidSession)
      throw new ForbiddenRequestException(
        'Your session has expired. Please login again.',
      )

    // If all is well, allow use to access the route
    // Remove email address from the found user

    res.locals.user = foundUser
    res.locals.isLoggedIn = true
    req.user = foundUser

    // User allowed to access the next route
    next()
  },
)

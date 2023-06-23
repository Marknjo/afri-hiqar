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
    const authToken = req.headers.authorization

    let jwtToken: string | undefined
    // Assign token from header or cookie
    if (authToken && authToken.startsWith('Bearer')) {
      // Assign header token
      jwtToken = authToken.split(' ').at(-1)
    }

    // Assign cookie from the cookie request (client side)
    if (req.cookies && req.cookies.jwt) {
      jwtToken = req.cookies.jwt
    }

    // If no token, send error message
    if (!jwtToken)
      throw new ForbiddenRequestException(
        'You are trying to access a protected resource. Please login or find necessary credentials to continue.',
      )

    // Verify token (get iat and user id) (@TODO: handle JWT error messages via global error)
    const jwtRes = (await promisify<string, jwt.Secret>(jwt.verify)(
      jwtToken,
      env.JWT_SECRET!,
    )) as unknown as jwt.JwtPayload

    const { userId, iat } = jwtRes

    // Find user by user id and verify
    // @TODO: implement prevent access of routes if user account is not activated after 24 hours of registering the account.
    const foundUser = await User.findById(userId)

    if (!foundUser || !foundUser.active)
      throw new ForbiddenRequestException(
        'We could not verify your identity. Please login with valid credentials to access requested resource.',
      )

    // Compare time token was created and now
    const isSessionExpired =
      await foundUser.checkPasswordWasChangedAfterTokenIssue(iat!)

    if (!isSessionExpired)
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

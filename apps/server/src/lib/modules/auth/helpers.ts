// HELPERS
// @TODO: signAndUpdate, signToken,
import { env } from 'process'
import { promisify } from 'util'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestException } from '@lib/exceptions/BadRequestException'
import setCookieOptions from '@utils/cookieOptions'

import { ISignTokenAndSendResponseOptions } from './types'

/**
 * Signs a JWT token
 * @param id user id
 * @param remember sets user to remember user for 1 week
 */
const signJWTtoken = (id: string, remember: boolean) => {
  const jwtSecret = env.JWT_SECRET
  const jwtExpiresInADay = env.JWT_EXPIRES_IN_WEEK
  const jwtExpiresInAWeek = env.JWT_EXPIRES_IN_DAY

  if (!jwtSecret) throw new BadRequestException('JWT_SECRET not set', 500)
  if (!jwtExpiresInADay || !jwtExpiresInAWeek)
    throw new BadRequestException('JWT_EXPIRES_IN not set', 500)

  return promisify<string | Buffer | object, string, jwt.SignOptions>(jwt.sign)(
    { id },
    jwtSecret,
    {
      expiresIn: remember ? jwtExpiresInADay : env.JWT_EXPIRES_IN_DAY,
    },
  )
}

/**
 * Sign Token and Send response
 *
 * Does four functions
 *
 * -> Sign JWT Token
 *
 * -> Assign jwt cookie to response
 *
 * -> Remove unwanted fields from the response
 *
 * -> Send the response with user attached
 *
 * @param req Request instance
 * @param  res Response instance
 * @param options configurations
 */
export const signTokenAndSendResponse = async (
  req: Request,
  res: Response,
  options: ISignTokenAndSendResponseOptions,
) => {
  try {
    // set user
    let { user, remember } = options

    // Sign Token
    const jwtToken = await signJWTtoken(user.id, remember)

    // Add token to cookie response
    //setJwtCookie(req, res, jwtToken, { allowRemember: true, remember });
    const cookieOptions = setCookieOptions(req, {
      allowRemember: true,
      remember,
    })

    res.cookie('jwt', jwtToken, cookieOptions)

    // Prep fields to respond
    // Remove password field from response, passwordUpdatedAt
    user.password = undefined
    user.passwordUpdatedAt = undefined
    //user.email = undefined;

    // Send response
    res.status(200).json({
      status: 'success',
      token: jwtToken,
      ...(options.message ? { message: options.message } : {}),
      data: {
        user,
      },
    })
  } catch (error) {
    throw error
  }
}

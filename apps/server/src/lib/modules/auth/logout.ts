import { Request, Response } from 'express'

import { BadRequestException } from '@lib/exceptions/BadRequestException'

import { signTokenAndSendResponse } from './helpers'

/**
 * Logout user
 */
export const logout = (req: Request, res: Response) => {
  if (!req.user) throw new BadRequestException('User already logged out')

  // set log out cookie
  /// Logout user using clearCookie instead of setting value to jwt, old implementation -> res.cookie('jwt', 'logout', cookieOptions);
  res.clearCookie('jwt')

  /// Remove originalPageUrl from list of cookies
  res.clearCookie('originPageUrl')

  // send success
  signTokenAndSendResponse(req, res, {
    user: req.user!,
    remember: false,
    message: 'You have successfully signed out',
    invalidateToken: true,
    resWithoutUser: true,
  })
}

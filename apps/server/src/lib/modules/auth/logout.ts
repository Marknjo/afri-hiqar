import { Request, Response } from 'express'

/**
 * Logout user
 */
export const logout = (_req: Request, res: Response) => {
  // set log out cookie
  /// Logout user using clearCookie instead of setting value to jwt, old implementation -> res.cookie('jwt', 'logout', cookieOptions);
  res.clearCookie('jwt')

  /// Remove originalPageUrl from list of cookies
  res.clearCookie('originPageUrl')

  // send success
  res
    .status(200)
    .json({ status: 'success', message: 'You have successfully signed out' })
}

import { CookieOptions, Request } from 'express'
import { env } from 'process'

interface ICookieOptions {
  allowRemember: boolean
  remember: boolean
  customExpiresIn?: number
}

/**
 * Helper function for setting cookies options
 * @param  req Express Request
 * @param configOptions Configuration options -> Remember for login users or sining, and custom expires for custom cases where time is to be set
 * @returns Returns nothing. It is just a configuration utility
 */
const setCookieOptions = (req: Request, configOptions: ICookieOptions) => {
  const configDefaults = {
    allowRemember: false,
    remember: false,
    customExpiresIn: 1,
  }
  // Initialize configs
  const { customExpiresIn, remember, allowRemember } = {
    ...configDefaults,
    ...configOptions,
  }

  // Set timers
  let expiresIn = new Date(Date.now() + customExpiresIn)

  /// Handle login and signup cases -> remember me
  if (allowRemember) {
    expiresIn = remember
      ? new Date(Date.now() + 7 * 24 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 1000)
  }

  /// Define cookie options
  const cookieOptions: CookieOptions = {
    expires: expiresIn,
    httpOnly: true,
    sameSite: true,
  }

  // Secure cookie check
  // NOTE: Requires more finessing to handle live site
  if (req.protocol === 'https' && env.NODE_ENV === 'production')
    cookieOptions.secure = true

  // Set cookie
  return cookieOptions
}

export default setCookieOptions

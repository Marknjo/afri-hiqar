import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'
import { UserRoles } from '@models/types'
import { NextFunction, Request, Response } from 'express'

/**
 * Restricts route access to specific user roles
 *
 * The middleware must immediately follow a protect route, as it access user attached to the request.
 * @param  roles Array of user roles i.e. admin, user, lead-guide, guide
 * @returns Next function with error or to pass to the next handler
 */
export const restrictTo = (...roles: Array<UserRoles>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user!.role as UserRoles

    /// Check if the current user has one of the roles defined in the roles
    if (roles.includes(role)) {
      // user is allowed to access the route
      return next()
    }

    // User does nto have necessary credentials
    throw new ForbiddenRequestException(
      'You do not have the necessary credentials to access this resource.',
    )
  }
}

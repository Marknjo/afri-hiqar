import { asyncWrapper } from '@utils/handlerWrappers'
import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'

import Api from '@models/apiModel'
import { IUser } from '@models/types'

import { TGenericRequestHandler } from '../handlersFactory'

/**
 * Protect routes (Login users access) middleware
 */
export const guard: TGenericRequestHandler = asyncWrapper(
  async (req, _res, next) => {
    // Don't hit db if there is apiKey in the request
    if (req.apiKey) {
      return next()
    }

    // Get api key from the header or cookie
    let consumerApiKey = req.headers['x-api-key'] as string | undefined

    // Assign cookie from the cookie request (client side)
    if (req.cookies && req.cookies['api-cookie']) {
      consumerApiKey = req.cookies['api-cookie'] as string | undefined
    }

    // If no apiKey, send error message
    if (!consumerApiKey)
      throw new ForbiddenRequestException(
        'You are trying to access a protected API. Please login and create an account with AfriHiqar, then generate your API KEY to continue.',
      )

    const [apiKey, apiKeyId] = consumerApiKey.split('/')

    // Find incoming token by id
    const serverApiKeyRes = await Api.findById(apiKeyId)

    /// Don't allow un-stored api keys/user is not active keys
    if (!serverApiKeyRes || (!serverApiKeyRes.user as unknown as IUser).active)
      throw new ForbiddenRequestException(
        'Access to this API denied. Please register to generate a valid API KEY.',
      )

    /// Don't allow expired tokens
    if (
      Date.now() > new Date(serverApiKeyRes.expiresIn).getTime() &&
      !serverApiKeyRes.isDefault
    )
      throw new ForbiddenRequestException(
        'Looks like your API key is expired. Please generate a new new one to continue enjoying the service.',
      )

    // Check if it is a valid token
    const isValidApiKey = serverApiKeyRes.compareApiKey(
      apiKey,
      serverApiKeyRes.apiKey,
    )

    if (!isValidApiKey)
      throw new ForbiddenRequestException(
        'Your session has expired. Please login again.',
      )

    // update default apiKey Expires in if it expires in a month time
    if (
      new Date(serverApiKeyRes.expiresIn).getTime() &&
      serverApiKeyRes.isDefault
    ) {
      // defined dates
      const now = Date.now()
      const expiresIn = new Date(serverApiKeyRes.expiresIn).getTime()
      const month = now + 1000 * 60 * 60 * 24 * 30
      const hasExpired = new Date().getMonth() + month > expiresIn

      if (hasExpired) {
        // set expires in 10 years
        const nextExpiresIn =
          now + 1000 * 60 * 60 * 24 * 365 * 10 + expiresIn - now
        await Api.updateOne({ expiresIn: nextExpiresIn })
      }
    }

    // If all is well, allow use to access the route
    req.apiKey = apiKey
    req.apiKeyIsDefault = serverApiKeyRes.isDefault

    // User allowed to access the next route
    next()
  },
)

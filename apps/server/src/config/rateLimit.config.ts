import { NextFunction, Request, Response } from 'express'

import rateLimit, { Options, RateLimitRequestHandler } from 'express-rate-limit'

const limiter: Partial<Options> = {
  windowMs: 1000 * 60 * 60, // limit 100 requests in 1 hour
  max: 100,
  message: 'Too many requests from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
}
const rateLimiterCb = rateLimit(limiter)

export default (req: Request, res: Response, next: NextFunction) => {
  const isDefaultConsumer = req.apiKeyIsDefault

  // Do not rate limit a default apiKey request
  if (isDefaultConsumer) {
    next()
    return
  }

  /// Rate limit other api Keys requests
  ;(
    rateLimiterCb(req, res, next) as unknown as Promise<RateLimitRequestHandler>
  ).catch(next)
}

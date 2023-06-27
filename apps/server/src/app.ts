import { env } from 'process'
import { resolve } from 'path'
// import { randomBytes } from 'crypto'

import express, { Application, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'

/* @ts-ignore lacks ts support*/
import { xss } from 'express-xss-sanitizer'

/// Local imports
import * as api from '@lib/modules/api'
import { logger } from '@config/logger.config'

// Routes
import publicPagesRouter from '@routes/publicPagesRouter'
import apiRouter from '@routes/apiRouter'
import bookingsRouter from '@routes/bookingsRouter'
import mediaRouter from '@routes/mediaRouter'
import reviewsRouter from '@routes/reviewsRouter'
import toursRouter from '@routes/toursRouter'
import usersRouter from '@routes/usersRouter'
import { NotFoundException } from '@lib/exceptions/NotFoundException'
import globalExceptionHandler from '@lib/middlewares/globalExceptionHandler'
import { isDev } from '@utils/env'
import rateLimitConfig from '@config/rateLimit.config'

const app: Application = express()

// console.log(randomBytes(32).toString('hex'))

/// Configs
//- cors for all HTTP Methods
const originUrl = isDev ? env.APP_CLIENT_URL_DEV : env.APP_CLIENT_URL_PROD
const corsOpts: CorsOptions = {
  origin: originUrl,
  credentials: true,
}
app.use(cors(corsOpts))
app.options('*', cors(corsOpts))

//- setup helmet as default
app.use(helmet())

//- Sanitize incoming queries
app.use(mongoSanitize())

//- API GUARD
app.use(api.guard)

//- Rate Limiter
app.use(rateLimitConfig)

/// setup
const apiVersion = env.API_VERSION || 1

/// Set view engines
/// Set Pug as the default view template engine
app.set('view engine', 'pug')

/// Set view path
app.set('views', resolve(__dirname, 'views'))

/// logger
logger(app)

/// Configs
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '2mb' })) // for images max-size 2mb
app.use(cookieParser())

//- Configure XSS filters
app.use(xss())

//- Prevent HTTP Parameters pollution for Tours filtering
const whitelist = [
  'duration',
  'price',
  'ratingsAverage',
  'ratingsQuantity',
  'difficulty',
  'maxGroupSize',
  'createdAt',
]
app.use(hpp({ whitelist }))

/// performance
app.use(compression())

/// Routes
const baseUrl = (route: string) => `/api/v${+apiVersion}/${route}`

//- Public Routes
app.use(baseUrl(''), publicPagesRouter)

//- API Routes
app.use(baseUrl('key'), apiRouter)
app.use(baseUrl('users'), usersRouter)
app.use(baseUrl('bookings'), bookingsRouter)
app.use(baseUrl('media'), mediaRouter)
app.use(baseUrl('reviews'), reviewsRouter)
app.use(baseUrl('tours'), toursRouter)

/// Error Handling
// 404 response handler
app.all('*', req => {
  const message = `${req.originalUrl} cannot be found in this server.`
  throw new NotFoundException(message)
})

/// Global Error Handling
app.use(globalExceptionHandler)

export default app

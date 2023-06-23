import { env } from 'process'
import { resolve } from 'path'
// import { randomBytes } from 'crypto'

import express, { Application } from 'express'
import cookieParser from 'cookie-parser'

/// Local imports

// Routes
import { logger } from '@config/logger.config'
import bookingsRouter from '@routes/bookings'
import mediaRouter from '@routes/media'
import reviewsRouter from '@routes/reviews'
import toursRouter from '@routes/tours'
import usersRouter from '@routes/users'
import { EResStatus, TJsonRes } from '@lib/types/JsonRes'
import { NotFoundException } from '@lib/exceptions/NotFoundException'
import globalExceptionHandler from '@lib/middlewares/globalExceptionHandler'

const app: Application = express()

// console.log(randomBytes(32).toString('hex'))

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
app.use(cookieParser())

/// performance

/// Routes
app.get(`/api/v${+apiVersion}/_health`, (_req, res: TJsonRes) => {
  res.json({
    status: EResStatus.SUCCESS,
    data: {
      message: 'Server is live',
    },
  })
})
const baseUrl = (route: string) => `/api/v${+apiVersion}/${route}`

app.use(baseUrl('bookings'), bookingsRouter)
app.use(baseUrl('media'), mediaRouter)
app.use(baseUrl('reviews'), reviewsRouter)
app.use(baseUrl('tours'), toursRouter)
app.use(baseUrl('users'), usersRouter)

/// Error handling
// 404 response handler
app.all('*', req => {
  const message = `${req.originalUrl} cannot be found in this server.`
  throw new NotFoundException(message)
})

/// global error handling
app.use(globalExceptionHandler)

export default app

import { env } from 'process'
import express, { Application } from 'express'
import { logger } from '@config/logger.config'

/// Local imports

// Routes
import bookingsRouter from '@routes/bookings'
import mediaRouter from '@routes/media'
import reviewsRouter from '@routes/reviews'
import toursRouter from '@routes/tours'
import usersRouter from '@routes/users'
import { EResStatus, JsonRes } from '@lib/types/JsonRes'

const app: Application = express()

/// setup
const apiVersion = env.API_VERSION || 1

/// logger
logger(app)

/// Configs
app.use(express.json({ limit: '10kb' }))

/// performance

/// Routes
app.get(`/api/v${+apiVersion}/_health`, (_req, res: JsonRes) => {
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

export default app

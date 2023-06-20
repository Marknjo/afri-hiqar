import { env } from 'process'
import express, { Application } from 'express'
import { logger } from '@config/logger.config'

const app: Application = express()

/// setup
const apiVersion = env.API_VERSION || 1

/// logger
logger(app)

/// performance

/// Routes
app.get(`/api/v${+apiVersion}`, (_req, res) => {
  res.send('Hello World haha!')
})

export default app

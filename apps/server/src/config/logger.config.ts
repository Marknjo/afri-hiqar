import { join } from 'path'
import { createWriteStream } from 'fs'
import morgan from 'morgan'
import { isProd } from '@utils/env'
import { Application } from 'express'

export function logger(app: Application) {
  if (!isProd) {
    app.use(morgan('dev'))
    return
  }

  const accessLogStream = createWriteStream(
    join(__dirname, '../logs', 'access.log'),
    { flags: 'a' },
  )

  app.use(morgan('combined', { stream: accessLogStream }))
}

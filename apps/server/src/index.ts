import 'module-alias/register'
import process, { env } from 'process'

// handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`💥💥💥 UNCAUGHT EXCEPTION: ${err.name} - ${err.message}`)
  console.log(`🗺: ${err.stack}`)
  console.log('😭😭😭 Server shutting down...')

  process.exit()
})

/// local imports
import './config/dotenv.config'
import app from './app'
import './config/mongo.config'
import { isProd } from '@utils/env'

/// start server
const port = env.APP_PORT || 3001
const appName = env.APP_NAME || 'Example'

//- Spin up server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`${appName} app running on http://localhost:${port}`)
})

// HANDLE ERRORS
// Server async errors
process.on('unhandledRejection', (reason, promise) => {
  console.log(`💥💥💥UNHANDLED REJECTIONS: ${reason} -> ${promise}`)
  console.log('😭😭😭 Server shutting down...')

  server.close(() => {
    process.exit()
  })
})

// Handling Sigterm errors
isProd &&
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED: Shutting down gracefully')
    server.close(() => {
      console.log('😢😢😢 Process terminates')
    })
  })

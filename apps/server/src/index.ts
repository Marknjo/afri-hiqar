import 'module-alias/register'
import './config/dotenv.config'
import { env } from 'process'
import app from './app'
import './config/mongo.config'

/// start server
const port = env.APP_PORT || 3001
const appName = env.APP_NAME || 'Example'
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`${appName} app listening at http://localhost:${port}`)
})

import './dotenv.config'
/* eslint-disable no-console */
/* eslint-disable consistent-return */
// Globals
import { env } from 'process'

// 3rd Party
import mongoose from 'mongoose'
import { isProd } from '@utils/env'

/**
 * Make online mongodb connection string
 * @param url DB Url string
 * @param pass DB PASSWORD
 * @param coll DB default collection name
 * @param user DB root username
 * @returns mongo connection string
 */
function replacePlaceholders(
  url: string,
  pass: string,
  coll: string,
  user: string,
  host?: string,
  port?: string,
) {
  let replaceUrl: string = url

  if (host) replaceUrl = replaceUrl.replace(/<HOST>/, host)

  if (port) replaceUrl = replaceUrl.replace(/<PORT>/, port)

  return replaceUrl
    .replace('<PASS>', pass)
    .replace('<COLLECTION>', coll)
    .replace('<USER>', user)
}

function generateDbConnection(): string | undefined {
  const localDbConn = env.DB_LOCAL_URL

  const onlineDbConn = env.DB_MONGO_ONLINE
  const pass = env.MONGO_INITDB_ROOT_PASSWORD
  const coll = env.DB_MONGO_COLLECTION
  const port = env.DB_PORT
  const host = env.DB_HOST
  const user = env.MONGO_INITDB_ROOT_USERNAME

  if (!localDbConn || !pass || !coll || !user || !host || !port) return

  /// production
  if (isProd && onlineDbConn)
    return replacePlaceholders(onlineDbConn, pass, coll, user)

  /// development string
  return replacePlaceholders(localDbConn, pass, coll, user, host, port)
}
// SETUP DB
try {
  console.log('\n> Connecting to mongodb server...')

  const dbConnection = generateDbConnection()

  if (!dbConnection) throw new Error('Db connection string incorrect!')
  // Return success message
  mongoose.connect(dbConnection, {
    connectTimeoutMS: 1000,
    serverSelectionTimeoutMS: 5000,
  })

  console.log('\n🙌🙌🙌 Connection to MongoDb successful...')
} catch (error: unknown) {
  const errorRes = error as Error

  console.error(`\n 💥💥💥 ${errorRes.name} ${errorRes.message}`)
  console.log(errorRes.stack)
}

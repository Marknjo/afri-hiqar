import { env } from 'process'
import mongoose from 'mongoose'

import './dotenv.config'
/* eslint-disable no-console */
/* eslint-disable consistent-return */
// Globals

// 3rd Party
import { isProd } from '../utils/env'

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

export interface IEnvs {
  DB_LOCAL_URL: string
  DB_MONGO_PROD_URL?: string
  MONGO_INITDB_ROOT_PASSWORD: string
  DB_MONGO_COLLECTION: string
  DB_PORT: string
  DB_HOST: string
  MONGO_INITDB_ROOT_USERNAME: string
}

export function generateDbConnection(envs?: IEnvs): string | undefined {
  const localDbConn = env.DB_LOCAL_URL || envs?.DB_LOCAL_URL

  const onlineDbConn = env.DB_MONGO_PROD_URL || envs?.DB_MONGO_PROD_URL
  const pass =
    env.MONGO_INITDB_ROOT_PASSWORD || envs?.MONGO_INITDB_ROOT_PASSWORD
  const coll = env.DB_MONGO_COLLECTION || envs?.DB_MONGO_COLLECTION
  const port = env.DB_PORT || envs?.DB_PORT
  const host = env.DB_HOST || envs?.DB_HOST
  const user =
    env.MONGO_INITDB_ROOT_USERNAME || envs?.MONGO_INITDB_ROOT_USERNAME

  if (!localDbConn || !pass || !coll || !user || !host || !port) return

  /// production
  if (isProd && onlineDbConn)
    return replacePlaceholders(onlineDbConn, pass, coll, user)

  /// development string
  return replacePlaceholders(localDbConn, pass, coll, user, host, port)
}

const dbConnectionUrl = generateDbConnection()

// SETUP DB
export function initDB(connectionUrl: string | undefined) {
  try {
    console.log('\n> Connecting to mongodb server...')

    if (!connectionUrl) throw new Error('Db connection string incorrect!')

    // Return success message
    mongoose.connect(connectionUrl, {
      connectTimeoutMS: 1000,
      serverSelectionTimeoutMS: 5000,
    })

    console.log('\n🙌🙌🙌 Connection to MongoDb successful...')
  } catch (error: unknown) {
    const errorRes = error as Error

    console.error(`\n 💥💥💥 ${errorRes.name} ${errorRes.message}`)
    console.log(errorRes.stack)
  }
}

/// Ensures we can load db with custom url (loading dev data)
if (dbConnectionUrl) {
  initDB(dbConnectionUrl)
}

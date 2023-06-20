import { env } from 'process'
import express, { Application } from 'express'

const app: Application = express()

const apiVersion = env.API_VERSION || 1

app.get(`/api/v${+apiVersion}`, (_req, res) => {
  res.send('Hello World haha!')
})

export default app

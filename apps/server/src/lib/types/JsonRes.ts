import { Response } from 'express'

export enum EResStatus {
  SUCCESS = 'success',
  FAILURE = 'failed',
  ERROR = 'error',
  NOT_FOUND = 'not found',
  REDIRECT = 'redirect',
}

export type JsonRes = Response<{
  status: EResStatus
  data: { message: string; payload?: string }
}>

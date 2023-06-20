import { Response } from 'express'

export enum EExceptionStatusCodes {
  BAD_REQUEST = 400,
  VALIDATION = 400,
  ERROR = 500,
  NOT_FOUND = 404,
  REDIRECT = 302,
}

export enum EResStatus {
  SUCCESS = 'success',
  FAILURE = 'failed',
  ERROR = 'error',
  NOT_FOUND = 'not found',
  REDIRECT = 'redirect',
}

export type TJsonRes = Response<{
  status: EResStatus
  data: { message: string; payload?: string }
}>

export interface IExceptionResponse {
  status: EResStatus
  statusCode: EExceptionStatusCodes
  data: {
    message?: string
    field?: string | undefined
    stack?: string
  }
}

export type TExceptionCollection = Array<IExceptionResponse>

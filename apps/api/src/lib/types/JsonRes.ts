import { Response } from 'express'

export enum EExceptionStatusCodes {
  REQUEST_UNAUTHORIZED = 401,
  REQUEST_NOT_ACCEPTABLE = 406,
  REQUEST_FORBIDDEN = 403,
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
  message?: string
  data?: { [payload: string]: string }
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

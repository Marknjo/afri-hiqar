import { IQueryString } from '@lib/modules'
import { IUser } from '@models/types'

export {}

declare global {
  namespace Express {
    export interface Request {
      optionalFilters?: any
      query?: IQueryString
      currentId?: string
      user?: IUser
      tourId?: string
      filename?: string
      apiKey?: string
      payload?: { [key: string]: any } | [{ [key: string]: any }]
    }
  }
}

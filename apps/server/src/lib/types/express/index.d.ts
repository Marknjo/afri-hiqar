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
    }
  }
}

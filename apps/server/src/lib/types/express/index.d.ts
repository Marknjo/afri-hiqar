import { IQueryString } from '@lib/modules'

export {}

declare global {
  namespace Express {
    export interface Request {
      optionalFilters?: any
      query?: IQueryString
    }
  }
}

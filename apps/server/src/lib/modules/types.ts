export enum EModelNames {
  TOUR = 'tour',
  BOOKING = 'booking',
  REVIEW = 'review',
  USER = 'user',
  MEDIA = 'media',
}

export interface IGenericObject {
  [key: string]: string
}

export interface IQueryString {
  page?: string
  sort?: string
  fields?: string
  limit?: string
}

export interface IGenericHandlerOption {
  optionalFilters?: any
  modelName: EModelNames
}

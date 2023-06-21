import { NextFunction, Request, Response } from 'express'

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

export interface IGetOneOptions {
  modelName: string
  message?: string
  populateOptions?: { path: string; select: string }
}

export type TGenericHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void

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

export interface ICreateOneOptions {
  modelName: string
  message?: string
  requiredFields?: Array<string>
  fileFieldName?: string
}

export type TGenericRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Response | void

export type TRequestWithBody<TParam, TBody> = (
  req: Request<TParam, {}, TBody>,
  res: Response,
  next: NextFunction,
) => Response | void

export type TGenericRequestAsync = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>

export type TGenericRequestWithBodyAsync<TParam, TBody> = (
  req: Request<TParam, {}, TBody>,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>

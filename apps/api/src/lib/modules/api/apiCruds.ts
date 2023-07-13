import { isValidObjectId } from 'mongoose'

import Api from '@models/apiModel'
import { IApi } from '@models/types'
import {
  EModelNames,
  TGenericRequestHandler,
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../handlersFactory'
import { asyncWrapper } from '@utils/handlerWrappers'
import { filterRequiredFields } from '@utils/filterRequiredFields'
import { BadRequestException } from '@lib/exceptions/BadRequestException'
import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'

/// MIDDLEWARES

/**
 * MIDDLEWARE:
 * Ensures a User owns an API KEY before Managing it
 *  - Guards Create, Update, and delete actions
 */
export const hasApiKeyOwnership: TGenericRequestHandler = asyncWrapper(
  async (req, _res, next) => {
    const user = req.user!

    const { apiId } = req.params

    const requestedApiKey = await Api.findById(apiId)

    if (!requestedApiKey)
      throw new BadRequestException(
        `Api key with id ${
          apiId === undefined ? 'unknown' : apiId
        } does not exist in this server. Please generate a new key`,
      )

    if (requestedApiKey.user.id !== user.id)
      throw new ForbiddenRequestException(
        'You can only access api keys you own',
      )

    // save current data to the payload and prevent db re-fetch
    req.payload = requestedApiKey

    next()
  },
)

/**
 * MIDDLEWARE:
 *  Ensures a user cannot manage admin only fields (Filters required fields for update)
 *   i.e. change user, isDefault, or expireIn
 */
export const limitUserPrivilegesTo: TGenericRequestHandler = (
  req,
  _res,
  next,
) => {
  /// allow update if user owns the api
  const requiredFields = ['label']

  // filter unwanted fields
  const filteredFields = filterRequiredFields<{ label: string }>(
    requiredFields,
    req.body,
  )

  req.body = filteredFields

  next()
}

/**
 *  MIDDLEWARE:
 *  Allows admin to update certain fields
 *    - Admin cannot update API key field
 */
export const limitAdminPrivilegesTo: TGenericRequestHandler = (
  req,
  _res,
  next,
) => {
  const requiredFields = ['label', 'isDefault', 'expiresIn', 'user']

  // filter unwanted fields
  const filteredFields = filterRequiredFields<
    Pick<IApi, 'label' | 'isDefault' | 'expiresIn' | 'user'>
  >(requiredFields, req.body)

  /// check if user id is a valid mongo id format

  if (filteredFields.user && !isValidObjectId(filteredFields.user))
    throw new BadRequestException(
      `Looks like user id ${filteredFields.user} is an invalid id format`,
      403,
    )

  req.body = filteredFields

  next()
}

/**
 * MIDDLEWARE:
 * Ensures a login user is able to search their added apiKeys
 */
export const filterKeysByUserId: TGenericRequestHandler = (req, _res, next) => {
  /// allow update if user owns the api
  const user = req.user!

  req.optionalFilters = { user: user.id }

  next()
}

/**
 * CRUD Operations
 */
export const getAllApiKeys = getAll<IApi>({
  Model: Api,
  options: {
    modelName: EModelNames.API,
    message: 'Looks like you do not have api keys',
  },
})

export const getApiKey = getOne<IApi>(Api, { modelName: EModelNames.API })
export const updateApiKey = updateOne<IApi>(Api, { modelName: EModelNames.API })
export const deleteApiKey = deleteOne<IApi>(Api, { modelName: EModelNames.API })
export const addNewApiKey = createOne<IApi>(Api, { modelName: EModelNames.API })

import { asyncWrapper } from '@utils/handlerWrappers'
import Api from '@models/apiModel'
import { BadRequestException } from '@lib/exceptions/BadRequestException'

import { TGenericRequestHandler } from '../handlersFactory'
/**
 * This is a quick method to set the default api consumer
 */
export const addDefaultConsumer: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // get requested apiKeyID
    const { apiKeyId } = req.params

    // update
    const defaultApiResource = await Api.findOne({ isDefault: true })

    if (defaultApiResource) {
      throw new BadRequestException(
        `Looks like ${defaultApiResource.label} of id ${defaultApiResource.id} is already set to default. If you would wish to continue with this action, set it to false before continuing.`,
        403,
      )
    }

    const defaultApi = (await Api.findOneAndUpdate(
      { id: apiKeyId },
      { isDefault: true, expiresIn: Date.now() + 60 * 60 * 24 * 365 * 10 },
      { runValidators: true, new: true },
    ))!

    // return the api key to the user
    res.status(201).json({
      status: 'success',
      message: `${defaultApi.label} was upgraded to default status`,
    })
  },
)

import { generateApiKey } from 'generate-api-key'
import { v4 as uuidV4 } from 'uuid'

import { asyncWrapper } from '@utils/handlerWrappers'
import Api from '@models/apiModel'
import { ForbiddenRequestException } from '@lib/exceptions/ForbiddenRequestException'

import { TGenericRequestHandler } from '../handlersFactory'

/**
 * Creates a new API Key
 */
export const generateNewApiKey: TGenericRequestHandler = asyncWrapper(
  async (req, res) => {
    // get current login user
    const currentUser = req.user!

    // check if account is confirmed & active, throw error if not
    if (!currentUser.active) {
      throw new ForbiddenRequestException(
        'Looks like your account is dormant. Kindly react the help desk for account activation to continue',
      )
    }

    // get data - label
    const body = req.body

    console.log(uuidV4())

    // generate a new api key
    const apiKey = generateApiKey({
      method: 'uuidv5',
      name: body.label,
      dashes: false,
      namespace: uuidV4(),
      prefix: currentUser.accountConfirmed ? 'prod_app' : 'test_app',
    })

    // @TODO: add users privileges to prevent access
    /// save the api key to the user account

    const aDay = Date.now() + 1000 * 60 * 60 * 60 * 24
    const aYear = aDay * 365

    const apiExpiresIn = currentUser.accountConfirmed ? aYear : aDay

    const doc = await Api.create({
      user: body.user || currentUser.id,
      label: body.label,
      apiKey,
      expiresIn: body.expiresIn || apiExpiresIn,
      isDefault: body.isDefault || false,
    })

    // return the api key to the user
    res.status(201).json({
      status: 'success',
      message: 'A new api key was added to your account successfully',
      data: { apiKey: `${apiKey}/${doc.id}` },
    })
  },
)

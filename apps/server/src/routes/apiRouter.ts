import { Router } from 'express'

import * as api from '@lib/modules/api'
import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { EUserRoles } from '@models/types'

const router: Router = Router()

// middlewares
router.param('apiId', isValidIdMiddleware)

// AUTH GUARD
router.use(auth.protect)

/// USER
router.post('/generate', api.limitUserPrivilegesTo, api.generateNewApiKey)

// USER ROUTES ROUTES
router.get('/my-keys', api.filterKeysByUserId, api.getAllApiKeys)
router
  .route('/my-keys/:apiId')
  .all(api.hasApiKeyOwnership)
  .get(api.getApiKey)
  .patch(api.getAllApiKeys)
  .delete(api.deleteApiKey)

/**
 * ADMIN ONLY
 */
router.use(auth.restrictTo(EUserRoles.ADMIN))

router
  .route('/')
  .get(api.getAllApiKeys)
  .post(api.limitAdminPrivilegesTo, api.generateNewApiKey)

router.patch('/set-default-consumer', api.addDefaultConsumer)

router
  .route('/:apiId')
  .get(api.getApiKey)
  .patch(api.limitAdminPrivilegesTo, api.updateApiKey)
  .delete(api.deleteApiKey)
/**
 * Protected Routes
 */

export default router

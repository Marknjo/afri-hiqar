import { Router } from 'express'

import * as api from '@lib/modules/api'
import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { EResStatus, TJsonRes } from '@lib/types/JsonRes'

const router: Router = Router()

// middlewares
router.param('publicPageId', isValidIdMiddleware)

/**
 * Health Route
 */
router.get(`/_health`, (_req, res: TJsonRes) => {
  res.status(200).json({
    status: EResStatus.SUCCESS,
    message: 'Server is live',
  })
})
/**
 * Protected Routes
 */

export default router

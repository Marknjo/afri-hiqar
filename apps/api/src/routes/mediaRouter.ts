import { Router } from 'express'

import * as api from '@lib/modules/api'
import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'

const router: Router = Router()

// middlewares
router.param('mediaId', isValidIdMiddleware)

router.get('/', (req, res) => {
  res.send('Media Router')
})
/**
 * Protected Routes
 */

export default router

import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'

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

import * as user from '@controllers/user'
import { Router } from 'express'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'

const router: Router = Router()

// check for valid id
router.param('userId', isValidIdMiddleware)

/**
 * Getters
 */
router.route('/').get(user.getAllUsers).post(user.createUser)

/// PROTECTED ROUTES
router
  .route('/:userId')
  .get(user.getUser)
  .patch(user.updateUser)
  .delete(user.deleteUser)

export default router

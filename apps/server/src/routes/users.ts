import * as user from '@controllers/user'
import { Router } from 'express'

const router: Router = Router()

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

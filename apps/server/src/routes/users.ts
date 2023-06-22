import { Router } from 'express'
import * as user from '@controllers/user'
import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'

const router: Router = Router()

// check for valid id
router.param('userId', isValidIdMiddleware)

/**
 * Getters
 */
router.route('/').get(user.getAllUsers).post(user.createUser)

/// PROTECTED ROUTES

//- Auth
router.post('/sign-up', auth.signup)

//- CRUDS
router
  .route('/:userId')
  .get(user.getUser)
  .patch(user.updateUser)
  .delete(user.deleteUser)

export default router

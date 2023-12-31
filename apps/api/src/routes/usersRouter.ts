import { Router } from 'express'

import * as user from '@controllers/userController'
import * as auth from '@lib/modules/auth'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { EUserRoles } from '@models/types'

const router: Router = Router()

// check for valid id
router.param('userId', isValidIdMiddleware)

/**
 * API Protected Routes
 */

//- Auth
router.post('/sign-up', auth.signup)
router.post('/login', auth.login)

// password reset & forget
router.post('/forget-password', auth.forgetPassword)
router.post('/reset-password/:token', auth.resetPassword)

/// AUTH GUARD
router.use(auth.protect)

// @NOTE: Only logout a login user
router.get('/logout', auth.logout)
router.route('/confirm-account').patch(user.confirmAccount)

//- Login user routes
router.get('/me', user.getMe, user.getUser)
router.patch(
  '/update-me',
  user.uploadProfilePhoto,
  user.resizeProfilePhoto,
  user.updateUserMiddleware,
  user.updateMe,
)
router.patch('/update-password', user.updateMyPassword)
router.delete(
  '/delete-me',
  user.deleteMe,
  user.updateUserMiddleware,
  user.deleteMeResponse,
)

//- Admin Only
router.use(auth.restrictTo(EUserRoles.ADMIN))
router.route('/').get(user.getAllUsers).post(user.createUser)

//- CRUDS
router
  .route('/:userId')
  .get(user.getUser)
  .patch(user.updateUser)
  .delete(user.deleteUser)

export default router

import * as auth from '@lib/modules/auth'
import * as review from '@controllers/review'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'
import { UserRoles } from '@models/types'

const router: Router = Router({ mergeParams: true })

// middlewares
router.param('reviewId', isValidIdMiddleware)

/**
 * Getters
 */

/**
 * Protected Routes
 * Admin Area
 */

router.use(auth.protect)

router
  .route('/')
  .get(
    auth.restrictTo(UserRoles.USER, UserRoles.ADMIN, UserRoles.LEAD_GUIDE),
    review.filterGetReviews,
    review.getAllReviews,
  )
  .post(
    auth.restrictTo(UserRoles.USER),
    review.prepCreateReviewFields,
    review.createReview,
  )

// Review with ID
// - Restrict to user and admin
router.use(
  auth.restrictTo(UserRoles.ADMIN, UserRoles.USER, UserRoles.LEAD_GUIDE),
)

// - Allow only the current user to manipulate their reviews, but allow admin to do all actions
router.use('/:reviewId', review.checkIfUserHasTheReview)

// - GetOne, UpdateOne & Delete Review
router
  .route('/:reviewId')
  .get(review.getReview)
  .patch(review.updateReview)
  .delete(review.deleteReview)

/// EXPORT ROUTER
export default router

import { Router } from 'express'

import * as api from '@lib/modules/api'
import * as auth from '@lib/modules/auth'
import * as review from '@controllers/reviewController'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { EUserRoles } from '@models/types'

const router: Router = Router({ mergeParams: true })

// middlewares
router.param('reviewId', isValidIdMiddleware)

/**
 * Getters
 */
router
  .route('/')
  .get(
    auth.restrictTo(EUserRoles.USER, EUserRoles.ADMIN, EUserRoles.LEAD_GUIDE),
    review.filterGetReviews,
    review.getAllReviews,
  )
  .post(
    auth.restrictTo(EUserRoles.USER),
    review.prepCreateReviewFields,
    review.createReview,
  )

// Review with ID
// - Restrict to user and admin
router.use(
  auth.restrictTo(EUserRoles.ADMIN, EUserRoles.USER, EUserRoles.LEAD_GUIDE),
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

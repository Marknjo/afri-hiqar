import * as review from '@controllers/review'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'

const router: Router = Router()

// middlewares
router.param('reviewId', isValidIdMiddleware)

/**
 * Getters
 */
router.route('/').get(review.getAllReviews).post(review.createReview)

router
  .route('/:reviewId')
  .get(review.getReview)
  .patch(review.updateReview)
  .delete(review.deleteReview)

export default router

import * as review from '@controllers/review'
import { Router } from 'express'

const router: Router = Router()

/**
 * Getters
 */
router.route('/').get(review.getAllReviews).post(review.createReview)

router.get('/:reviewId', review.getReview)

export default router

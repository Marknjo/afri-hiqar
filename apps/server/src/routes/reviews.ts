import * as review from '@controllers/review'
import { Router } from 'express'

const router: Router = Router()

/**
 * Getters
 */
router.get('/', review.getAllReviews)

router.get('/:reviewId', review.getReview)

export default router

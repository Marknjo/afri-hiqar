import * as tour from '@controllers/tour'
import { Router } from 'express'

const router: Router = Router()

/**
 * Get all tours
 */
router.route('/').get(tour.getAllTours).post(tour.createTour)

router.route('/:tourId').get(tour.getTour).patch(tour.updateTour)

export default router

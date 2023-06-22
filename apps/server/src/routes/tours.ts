import * as tour from '@controllers/tour'
import { Router } from 'express'

const router: Router = Router()

/**
 * Public Routes
 */
//- Aliases Routes
router.get('/top-5-cheap-tours', tour.getCheapestTours, tour.getAllTours)

/**
 * Get all tours
 */
router.route('/').get(tour.getAllTours).post(tour.createTour)

/**
 * Protected Routes
 */

router
  .route('/:tourId')
  .get(tour.getTour)
  .patch(tour.updateTour)
  .delete(tour.deleteTour)

export default router

import * as tour from '@controllers/tour'
import { Router } from 'express'

const router: Router = Router()

/**
 * Public Routes
 */
//- Aliases Routes
router.get('/top-5-cheap-tours', tour.getCheapestTours, tour.getAllTours)
router.get('/top-5-best-rated-tours', tour.getTopRatedTours, tour.getAllTours)

// Get all tours
router.route('/').get(tour.getAllTours).post(tour.createTour)

/**
 * Protected Routes
 */

// Get tours statics by difficult level (prices, averageRatings e.t.c) - Restrict to admin/lead-guide
router.route('/tour-stats-by-difficulty').get(tour.getToursStatsByDifficulty)

router
  .route('/:tourId')
  .get(tour.getTour)
  .patch(tour.updateTour)
  .delete(tour.deleteTour)

export default router

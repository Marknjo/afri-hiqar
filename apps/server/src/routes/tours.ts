import * as tour from '@controllers/tour'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'

const router: Router = Router()

// middlewares
router.param('tourId', isValidIdMiddleware)

/**
 * Public Routes
 */

//- Aliases Routes
router.get('/top-5-cheap-tours', tour.getCheapestTours, tour.getAllTours)
router.get('/top-5-best-rated-tours', tour.getTopRatedTours, tour.getAllTours)

// Get all tours
router.route('/').get(tour.getAllTours).post(tour.createTour)

// @TODO: Get a single tour by id | Slug
router.route('/:tourId').get(tour.getTour)

/**
 * Protected Routes
 */

// Get tours statics by difficult level (prices, averageRatings e.t.c) - Restrict to admin/lead-guide/login users
router.route('/tour-stats-by-difficulty').get(tour.getToursStatsByDifficulty)

// Aggregator - return all tours by month
router.route('/monthly-plans/:year').get(tour.getMonthlyPlans)

// Aggregator - get tours within a given radius
router
  .route('/within-radius/:distance/center/:latlng/unit/:unit')
  .get(tour.getToursWithinARadius)

router
  .route('/near-location/:latlng/unit/:unit/:limit')
  .get(tour.getToursNearLocation)

// Admin only routes
router
  .route('/:tourId')
  .patch(tour.updateTour)
  .delete(tour.preTourDeletion, tour.deleteTour)

export default router

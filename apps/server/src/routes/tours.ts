import * as tour from '@controllers/tour'
import { Router } from 'express'

const router: Router = Router()

/**
 * Get all tours
 */
router.get('/', tour.getAllTours)

export default router

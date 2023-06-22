import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'

const router: Router = Router()

// middlewares
router.param('bookingId', isValidIdMiddleware)

router.get('/', (_req, res, _next) => {
  res.send('Bookings Router now')
})

export default router

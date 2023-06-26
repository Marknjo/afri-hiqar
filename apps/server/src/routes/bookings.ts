import * as auth from '@lib/modules/auth'
import * as booking from '@controllers/bookingController'
import { isValidIdMiddleware } from '@lib/middlewares/isValidIdMiddleware'
import { Router } from 'express'
import { EUserRoles } from '@models/types'

const router: Router = Router()

// middlewares
router.param('bookingId', isValidIdMiddleware)

router.use(auth.protect)

/**
 * Protected Routes
 */

/// CRUDs Routes
//- Group Restrictions to 'admin', 'lead-guide', 'guide'
router
  .route('/')
  .get(booking.aliasFilterBookingsByAgentRole, booking.getAllBooking)
  .post(booking.createBooking)

//- GetOne booking and patch
router
  .use(booking.aliasRestrictReadAndUpdate)
  .route('/:bookingId')
  .get(booking.getBooking)
  .patch(booking.updateBooking)

//- Restrict booking deletion to admin and lead-guide
router.delete(
  '/:bookingId',
  auth.restrictTo(EUserRoles.ADMIN, EUserRoles.LEAD_GUIDE),
  booking.deleteBooking,
)

/// EXPORT BOOKING ROUTER
export default router

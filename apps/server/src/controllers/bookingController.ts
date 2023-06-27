// CRUD HANDLERS
import { env } from 'process'
import Stripe from 'stripe'

import { BadRequestException } from '@lib/exceptions/BadRequestException'
import {
  EModelNames,
  TGenericRequestHandler,
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '@lib/modules/handlersFactory'
import Booking from '@models/bookingModel'
import { IBooking, ITour, IUser, EUserRoles } from '@models/types'
import { asyncHandlerWrapper, asyncWrapper } from '@utils/handlerWrappers'
import User from '@models/userModel'
import Tour from '@models/tourModel'
import { isDev } from '@utils/env'

// HELPERS
const createStripeBookingHelper = (session: Stripe.Event.Data.Object) => {
  asyncHandlerWrapper(async () => {
    // Get the session object
    const { client_reference_id, customer_details, amount_total } = session as {
      client_reference_id: string
      customer_details: { email: string }
      amount_total: number
    }

    /// Get user id
    const user = (await User.findOne({ email: customer_details.email }))!.id

    /// create booking
    await Booking.create({
      user,
      tour: client_reference_id,
      price: amount_total / 100,
      paymentMethod: 'stripe',
      paid: true,
    })
  }, true)
}

/**
 * MIDDLEWARES
 */

//- ALIASES
/**
 * Allows admins to see all bookings, regardless of the user role.
 *
 * Only allow lead guides to see their own bookings and other users (Not other lead guides and admins).
 *
 * Only allow guides to see their own bookings (not allowed to see other guides or seeing users bookings).
 *
 */
export const aliasFilterBookingsByAgentRole: TGenericRequestHandler =
  asyncWrapper(async (req, _res, next) => {
    const user = req.user!

    // Check who is querying
    if (user.role === EUserRoles.ADMIN) return next()

    // For guides & users, only return tours they have booked
    if (user.role === EUserRoles.GUIDE || user.role === EUserRoles.USER) {
      req.query = `agent=${user.id}` as any

      return next()
    }

    // For lead guides, only return their own tours and tours other agents (users/guides) have booked
    if (user.role === EUserRoles.LEAD_GUIDE) {
      // If there is a query where agent is set to null or current user id, create a query and stop further evaluation
      if (user.id === req.query.agent || req.query.agent === 'null')
        return next()

      // Find all bookings they have booked
      const agentBookings = await Booking.find({
        // @ts-ignore
        agent: { $ne: user.id, $ne: null },
      }).populate<{ agent: IUser }>({ path: 'agent', select: 'name role' })

      // Create a collection of agents ids, exclude admins and other lead-guides (a lead guide is only allowed to see their own bookings and all bookings done by guides)
      let queryString = `agent=${user.id}`

      // Do not process further if there is nothing in the agent Bookings array
      if (agentBookings.length === 0 || !agentBookings) {
        req.query = queryString as any
        return next()
      }

      const agentsIds = agentBookings.map(agt => {
        if (
          agt.agent.role !== EUserRoles.LEAD_GUIDE &&
          agt.agent.role !== EUserRoles.ADMIN
        ) {
          return agt.agent.id
        }
      })

      // Generate comma separated agent query i.e. (agent=adsfaslf2342kajl&agent=gsdfawf45erwrbc23)
      agentsIds.forEach(el => (queryString += `&agent=${el}`))
      req.query = queryString as any

      return next()
    }

    // next after filtering
    next(
      new BadRequestException('You are not authorize to perform this action!'),
    )
  })

export const aliasRestrictReadAndUpdate: TGenericRequestHandler = asyncWrapper(
  async (req, _res, next) => {
    const user = req.user!
    const role = user.role

    //- for admin allow all Read & Update activities with /:bookingId
    if (role === EUserRoles.ADMIN || role === EUserRoles.LEAD_GUIDE) {
      return next()
    }

    // get the booking id
    const bookingId = req.params.bookingId!

    /// Determine if current requester of a booking has right to edit it/update it/view it

    // - find the booking the user is trying to access
    const requestedBooking = await Booking.findById(bookingId)
      .populate<{ user: Pick<IUser, 'id'> }>({ path: 'user', select: 'id' })
      .populate<{ agent: Pick<IUser, 'id'> }>({ path: 'agent', select: 'id' })

    // -  the booking is not available
    if (!requestedBooking)
      throw new BadRequestException(
        `Can't find the booking (${bookingId}) you are trying to access.`,
      )

    const hasABooking =
      requestedBooking.user === user.id || requestedBooking.agent === user.id

    //- for users, restrict to those they've booked and act as agent
    //- for lead-guide restrict only to those they've acted as agent/all users
    //- for guides, restrict to those they've acted as agent
    if (hasABooking && (role === EUserRoles.USER || role === EUserRoles.GUIDE))
      return next()

    next(
      new BadRequestException(
        'You do not have necessary privileges to view this booking',
      ),
    )
  },
)

//// STRIPE BOOKING
/**
 * The handler checks if the user has already booked a tour.
 * If the tour is booked, in the future, user is asked if they want to help someone else book their tour.
 * @NOTE: There should be a discounting option, or a way for a user to book multiple tours under multiple names
 * @TODO: To be implemented later
 **/
export const checkBookingStatus: TGenericRequestHandler = asyncWrapper(
  async (req, res, next) => {
    // Send response to check if tour is booked

    // 1) Get tour Id and UserId
    const tourId = req.params.tourId
    const userId = req.user!.id

    // 2) Query booking with tour and user
    const bookings = await Booking.find({ tourId, userId })

    // Check if there are booking in the found bookings array

    if (bookings.length === 0) return next()

    const foundBookings = bookings.map(booking => {
      const startDate = String(
        (booking.tour as unknown as ITour).startDates.at(0)!,
      )

      const getStartDate = parseInt(String(new Date(startDate).getTime()), 10)
      const currentDate = Date.now()

      // Testing dates
      if (getStartDate >= currentDate) {
        return {
          name: (booking.tour as unknown as ITour).name,
          bookedAt: (booking.tour as unknown as ITour).createdAt,
          id: booking.tour.id,
        }
      }
    })

    // 3) Based on response check if tour start date is greater than current date (date.now())
    // Tour was booked in the past (Book again)
    if (foundBookings.length === 0 || !foundBookings.at(0)) {
      return next()
    }

    // 4) Return response to the client with the object {tourIsOpen, tourIsBooked} the
    return res.status(200).json({
      status: 'success',
      results: foundBookings.length,
      data: {
        tourIsOpen: true,
        tourIsBooked: true,
        tour: foundBookings,
      },
    })
  },
)

/**
 *  Start a payment process by receiving product and setting the product details
 */
export const getStripeCheckoutSession: TGenericRequestHandler = asyncWrapper(
  async (req, res, next) => {
    // 1). Get the tour by param TourId

    const tourId = req.params.tourId
    const tour = await Tour.findById(tourId)
    if (!tour || tour.length === 0)
      throw new BadRequestException(`Could not find tour with id ${tourId}`)

    // @HACK: Should add a proper login page because of how stripe checkouts out (issue with JWT cookie)
    let success_url = `${env.APP_CLIENT_URL_PROD}/my-bookings`

    if (isDev) {
      success_url = `${req.protocol}://${req.get('host')}/?price=${
        tour.price
      }&tour=${tour.id}&user=${req.user!.id}`
    }

    // 2). Create Stripe Session
    const session = await new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2022-11-15',
      typescript: true,
    }).checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url,
      cancel_url: `${env.APP_CLIENT_URL_PROD}/${tour.slug}`,
      customer_email: req.user!.email,
      client_reference_id: tour.id,

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: tour.price * 100,
            product_data: {
              name: tour.name,
              description: tour.summary,
              images: [`${env.APP_API_URL_PROD}/img/tours/${tour.imageCover}`],
            },
          },
        },
      ],
    })

    // 3). Send response
    res.status(200).json({
      status: 'success',
      data: {
        session,
      },
    })
  },
)

/**
 * Handle Stripe Webhook checkout
 * @NOTE: Only works is site is hosted
 */
export const stripeWebhookCheckoutHandler: TGenericRequestHandler =
  asyncWrapper(async (req, res) => {
    // get the signature from the header
    const signature = req.headers['stripe-signature']!

    // Create Event
    const apiKey = env.STRIPE_SECRET_KEY!
    const apiConfig: Stripe.StripeConfig = {
      apiVersion: '2022-11-15',
      typescript: true,
    }

    const event = await new Stripe(apiKey, apiConfig).webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY!,
    )

    // Check of checkout event is successful
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      await createStripeBookingHelper(session)
    }

    // send a success response
    res.status(200).json({
      status: 'success',
      received: true,
    })
  })

/**
 * Basic CRUDS
 * @NOTE: The following handlers are only accessible to admin and lead guide
 */
export const getAllBooking = getAll<IBooking>({
  Model: Booking,
  options: {
    modelName: EModelNames.BOOKING,
  },
})

export const getBooking = getOne<IBooking>(Booking, { modelName: 'booking' })
export const createBooking = createOne<IBooking>(Booking, {
  modelName: 'booking',
})
export const updateBooking = updateOne<IBooking>(Booking, {
  modelName: 'booking',
})
export const deleteBooking = deleteOne<IBooking>(Booking, {
  modelName: 'booking',
})

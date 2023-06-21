import { Router } from 'express'

const router: Router = Router()

router.get('/', (_req, res, _next) => {
  res.send('Bookings Router now')
})

export default router

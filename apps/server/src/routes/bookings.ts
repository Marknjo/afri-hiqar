import { Router } from 'express'

const router: Router = Router()

router.get('/', (_req, res) => {
  res.send('Bookings Router now')
})

export default router

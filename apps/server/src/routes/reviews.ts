import { Router } from 'express'

const router: Router = Router()

router.get('/', (req, res) => {
  res.send('Reviews Router')
})

export default router

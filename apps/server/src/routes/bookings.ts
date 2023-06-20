import { Router } from 'express'
import { asyncWrapper } from '@utils/handlerWrappers'

const router: Router = Router()

router.get(
  '/',
  asyncWrapper(async (_req, res, _next) => {
    const failedPromise = await new Promise((_, reject) =>
      setTimeout(
        () => reject({ status: 'error', message: 'Failed to login!' }),
        500,
      ),
    )
    console.log(failedPromise)

    if (failedPromise) {
    }

    res.send('Bookings Router now')
  }),
)

export default router

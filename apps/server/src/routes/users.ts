import * as user from '@controllers/user'
import { Router } from 'express'

const router: Router = Router()

/**
 * Getters
 */
router.get('/', user.getAllUsers)

export default router

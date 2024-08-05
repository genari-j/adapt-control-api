import type { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'

import { PaymentsController } from '../../controllers/payments/payments-controller'
import { PaymentsRepository } from '../../models/repositories/payments'

const controller = new PaymentsController(PaymentsRepository)

const paymentsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.get('/payments', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
}

export default paymentsRoutes

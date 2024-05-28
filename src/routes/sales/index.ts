import { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'

import { SalesController } from '../../controllers/sales/sales-controller'
import { SalesRepository } from '../../models/repositories/sales'
import { PaymentsRepository } from '../../models/repositories/payments'
import { SalesRelationshipProductRepository } from '../../models/repositories/sales-relationship-product'
import { ProductsRepository } from '../../models/repositories/products'

const controller = new SalesController(
  SalesRepository,
  PaymentsRepository,
  SalesRelationshipProductRepository,
  ProductsRepository,
)

const salesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/sales', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
  fastify.post('/sales', { preHandler: [authMiddleware] }, controller.create.bind(controller))
}

export default salesRoutes

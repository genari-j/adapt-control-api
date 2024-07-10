import { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'
import { createStorage } from '../../helpers'

import { ProductsController } from '../../controllers/products/products-controller'
import { ProductsRepository } from '../../models/repositories/products'
import { CategoriesRepository } from '../../models/repositories/categories'

const controller = new ProductsController(
  ProductsRepository,
  CategoriesRepository
)

const upload = createStorage('./uploads/products')

const productsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/products', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
  fastify.get('/products/:id', { preHandler: [authMiddleware] }, controller.getById.bind(controller))
  fastify.put('/products/:id', { preHandler: [authMiddleware, upload.single('avatar')] }, controller.update.bind(controller))
  fastify.delete('/products/:id', { preHandler: [authMiddleware] }, controller.delete.bind(controller))
  fastify.post('/products', { preHandler: [authMiddleware] }, controller.create.bind(controller))
}

export default productsRoutes

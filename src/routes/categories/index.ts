import { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'

import { CategoriesController } from '../../controllers/categories/categories-controller'
import { CategoriesRepository } from '../../models/repositories/categories'

const controller = new CategoriesController(
  CategoriesRepository
)

const categoriesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/categories', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
  fastify.post('/categories', { preHandler: [authMiddleware] }, controller.create.bind(controller))
}

export default categoriesRoutes

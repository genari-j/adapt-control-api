import type { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { createStorage, productsPath } from '../../helpers'
import { authMiddleware } from '../../middlewares/auth'

import { ProductsController } from '../../controllers/products/products-controller'
import { CategoriesRepository } from '../../models/repositories/categories'
import { ProductsRepository } from '../../models/repositories/products'

const upload = createStorage(productsPath)

const controller = new ProductsController(ProductsRepository, CategoriesRepository)

const productsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.get('/products', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
	fastify.get('/products/:id', { preHandler: [authMiddleware] }, controller.getById.bind(controller))
	fastify.put(
		'/products/:id',
		{ preHandler: [authMiddleware, upload.single('avatar')] },
		controller.update.bind(controller),
	)
	fastify.delete('/products/:id', { preHandler: [authMiddleware] }, controller.delete.bind(controller))
	fastify.post('/products', { preHandler: [authMiddleware] }, controller.create.bind(controller))
}

export default productsRoutes

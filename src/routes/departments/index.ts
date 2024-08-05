import type { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'

import { DepartmentsController } from '../../controllers/departments/departments-controller'
import { DepartmentsRepository } from '../../models/repositories/departments'

const controller = new DepartmentsController(DepartmentsRepository)

const departmentsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.get('/departments', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
}

export default departmentsRoutes

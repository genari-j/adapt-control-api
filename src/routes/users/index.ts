import type { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { createStorage, usersPath } from '../../helpers'
import { authMiddleware } from '../../middlewares/auth'

import { UsersController } from '../../controllers/users/users-controller'
import { DepartmentsRepository } from '../../models/repositories/departments'
import { ProfilePermissionsRepository } from '../../models/repositories/profile-permissions'
import { ProfilesRepository } from '../../models/repositories/profiles'
import { UsersRepository } from '../../models/repositories/users'

const controller = new UsersController(
	UsersRepository,
	DepartmentsRepository,
	ProfilesRepository,
	ProfilePermissionsRepository,
)

const upload = createStorage(usersPath)

const usersRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.post('/signin', controller.login.bind(controller))
	fastify.post('/signup', { preHandler: [authMiddleware] }, controller.create.bind(controller))

	fastify.get('/verify-token', controller.verifyToken.bind(controller))
	fastify.post('/password/recovery', controller.solicitationResetPassword.bind(controller))
	fastify.patch('/password/set-new', controller.updateUserPassword.bind(controller))

	fastify.get('/users', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
	fastify.get('/users/:id', { preHandler: [authMiddleware] }, controller.getById.bind(controller))

	fastify.put(
		'/users/:id',
		{ preHandler: [authMiddleware, upload.single('avatar')] },
		controller.update.bind(controller),
	)
	fastify.delete('/users/:id', { preHandler: [authMiddleware] }, controller.delete.bind(controller))
}

export default usersRoutes

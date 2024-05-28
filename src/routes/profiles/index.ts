import { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { authMiddleware } from '../../middlewares/auth'

import { ProfilesController } from '../../controllers/profiles/profiles-controller'
import { ProfilesRepository } from '../../models/repositories/profiles'

const controller = new ProfilesController(
  ProfilesRepository
)

const profilesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/profiles', { preHandler: [authMiddleware] }, controller.getAll.bind(controller))
}

export default profilesRoutes
